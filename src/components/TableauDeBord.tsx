import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Documents } from "../models/Documents";
import { PagedResponse } from "../models/PagedResponse";
import {
  getAllCompanies,
  getCompaniesByCriteria,
} from "../apicalls/apicallsCompanies";
import { getdocumentsByCriteria } from "../apicalls/apicallsDocuments";
import { DOCUMENT_STATUS } from "../utils/constants";
import "./TableauDeBord.css";
import { Toast } from "primereact/toast";
import { getAllVehicles } from "../apicalls/apicallsVehicle";
import {
  getTotalMaintenanceCost,
  getMaintenanceByCriteriaPaged,
  getTopVehiclesByMaintenanceCost,
} from "../apicalls/apicallsMaintenance";
import { Allvehiculedto } from "../apicalls/dtos/Allvehicledto";
import { MaintenanceRecord } from "../models/MaintenanceRecord";

interface DashboardStats {
  totalVehicles: number;
  totalSites: number;
  totalExpenses: number;
  monthlyExpenses: MaintenanceRecord[];
  expiringDocuments: Documents[];
  expiredDocuments: Documents[];
  vehicles: Allvehiculedto[];
  topVehiclesByCost: any[];
}

function TableauDeBord() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    totalSites: 0,
    totalExpenses: 0,
    monthlyExpenses: [],
    expiringDocuments: [],
    expiredDocuments: [],
    vehicles: [],
    topVehiclesByCost: [],
  });
  const [loading, setLoading] = useState(true);
  const toast = React.createRef<Toast>();

  const fetchDashboardData = async () => {
    try {
      // Fetch vehicles
      const vehiclesResponse = await getAllVehicles();
      const vehicles = vehiclesResponse.data.data || [];
      const totalVehicles = vehicles.length;

      // Calculate vehicle statistics
      const vehiclesByType = vehicles.reduce(
        (acc: { [key: string]: number }, vehicle) => {
          const type = vehicle.vtypename || "Non catégorisé";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {}
      );

      // Fetch sites count
      let totalSites = 0;
      try {
        const sitesResponse = await getCompaniesByCriteria("");
        totalSites = sitesResponse.data?.length || 0;
      } catch (error) {
        console.error("Error fetching companies:", error);
      }

      // Fetch expiring documents (15 days)
      let expiringDocuments: Documents[] = [];
      let expiredDocuments: Documents[] = [];
      try {
        // Fetch soon to expire documents
        const expiringResponse = await getdocumentsByCriteria(
          undefined, // document_number
          undefined, // type_id
          DOCUMENT_STATUS.EXPIRES_SOON, // status
          15, // number_of_days
          undefined, // vehicle_id
          1, // page
          100 // limit
        );
        expiringDocuments = expiringResponse.data?.data || [];

        // Fetch expired documents that need replacement
        const expiredResponse = await getdocumentsByCriteria(
          undefined, // document_number
          undefined, // type_id
          DOCUMENT_STATUS.EXPIRED, // status
          0, // number_of_days (not needed for expired)
          undefined, // vehicle_id
          1, // page
          100 // limit
        );
        expiredDocuments = expiredResponse.data?.data || [];

        console.log("Expiring documents:", expiringDocuments);
        console.log("Expired documents:", expiredDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }

      // Fetch maintenance records for the chart
      let maintenanceRecords: MaintenanceRecord[] = [];
      let totalExpenses = 0;
      try {
        const maintenanceResponse = await getMaintenanceByCriteriaPaged(1, 10);
        maintenanceRecords = maintenanceResponse.data.data || [];

        // Calculate total expenses from the maintenance records
        totalExpenses = maintenanceRecords.reduce(
          (total, record) => total + (record.cost || 0),
          0
        );
      } catch (error) {
        console.error("Error fetching maintenance:", error);
      }

      // Fetch top vehicles by maintenance cost
      let topVehiclesByCost: any[] = [];
      try {
        const topVehiclesResponse = await getTopVehiclesByMaintenanceCost(5);
        topVehiclesByCost = topVehiclesResponse.data.data || [];
      } catch (error) {
        console.error("Error fetching top vehicles by cost:", error);
      }

      setStats({
        totalVehicles,
        totalSites,
        totalExpenses,
        monthlyExpenses: maintenanceRecords,
        expiringDocuments,
        expiredDocuments,
        vehicles,
        topVehiclesByCost,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartData = {
    labels: stats.monthlyExpenses.map((record) =>
      new Date(record.serviceDate).toLocaleDateString("fr-FR")
    ),
    datasets: [
      {
        label: "Dépenses de Dépenses",
        data: stats.monthlyExpenses.map((record) => record.cost || 0),
        backgroundColor: "#4CAF50",
        borderColor: "#2E7D32",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="tableau-de-bord">
      <div className="stats-cards">
        <Card className="stats-card">
          <div className="card-content">
            <i className="pi pi-car" />
            <div className="stats-info">
              <h3>Total Véhicules</h3>
              <div className="stats-number">
                {loading ? (
                  <i
                    className="pi pi-spin pi-spinner"
                    style={{ fontSize: "1.4rem" }}
                  />
                ) : (
                  stats.totalVehicles
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="card-content">
            <i className="pi pi-building" />
            <div className="stats-info">
              <h3>Total Sites</h3>
              <div className="stats-number">
                {loading ? (
                  <i
                    className="pi pi-spin pi-spinner"
                    style={{ fontSize: "1.4rem" }}
                  />
                ) : (
                  stats.totalSites
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="card-content">
            <i className="pi pi-wallet" />
            <div className="stats-info">
              <h3>Total Dépenses</h3>
              <div className="stats-number">
                {loading ? (
                  <i
                    className="pi pi-spin pi-spinner"
                    style={{ fontSize: "1.4rem" }}
                  />
                ) : (
                  new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                  }).format(stats.totalExpenses)
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="chart-section">
        <Card
          title="Dépenses de Dépenses Récentes"
          subTitle="Évolution des coûts sur les derniers mois"
          className="fade-in"
        >
          <div style={{ height: "400px" }}>
            {loading ? (
              <div className="flex align-items-center justify-content-center h-100">
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "2rem" }}
                />
              </div>
            ) : (
              <Chart type="line" data={chartData} options={chartOptions} />
            )}
          </div>
        </Card>
      </div>

      {/* Top Vehicles by Maintenance Cost Section */}
      <div className="top-vehicles-section">
        <Card
                  title="Top 5 Véhicules par Coût de Dépenses"
        subTitle="Véhicules avec les dépenses de dépenses les plus élevées"
          className="fade-in"
          header={
            <div className="flex align-items-center gap-2 mb-3">
              <i
                className="pi pi-dollar"
                style={{ fontSize: "1.5rem", color: "#EF5350" }}
              />
            </div>
          }
        >
          <DataTable
            value={stats.topVehiclesByCost}
            loading={loading}
            emptyMessage="Aucune donnée de dépenses disponible"
            responsiveLayout="scroll"
            showGridlines
            stripedRows
            size="small"
            className="top-vehicles-table"
          >
            <Column
              field="rank"
              header="#"
              style={{ width: "60px" }}
              body={(rowData, options) => (
                <div className="rank-badge">{options.rowIndex + 1}</div>
              )}
            />
            <Column
              field="licenseplate"
              header="Plaque d'immatriculation"
              sortable
            />
            <Column field="marque" header="Modèle" sortable />
            <Column
              field="total_cost"
              header="Coût Total"
              sortable
              body={(rowData) => (
                <span className="cost-value">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                  }).format(rowData.total_cost || 0)}
                </span>
              )}
            />
            <Column
              field="maintenance_count"
              header="Nombre d'interventions"
              sortable
              body={(rowData) => (
                <span className="maintenance-count">
                  {rowData.maintenance_count || 0} interventions
                </span>
              )}
            />
          </DataTable>
        </Card>
      </div>

      <div className="documents-section">
        <div className="grid">
          <div className="col-12 lg:col-6">
            <Card
              title="Documents à Expirer (15 jours)"
              subTitle="Documents nécessitant une attention rapide"
              className="fade-in"
              header={
                <div className="flex align-items-center gap-2 mb-3">
                  <i
                    className="pi pi-exclamation-triangle"
                    style={{ fontSize: "1.5rem", color: "#FFA726" }}
                  />
                </div>
              }
            >
              <DataTable
                value={stats.expiringDocuments}
                paginator
                rows={5}
                loading={loading}
                emptyMessage="Aucun document à expirer dans les 15 jours"
                responsiveLayout="scroll"
                showGridlines
                stripedRows
                size="small"
              >
                <Column field="doc_number" header="Numéro" sortable />
                <Column field="type.name" header="Type" sortable />
                <Column
                  field="vehicle.licenseplate"
                  header="Véhicule"
                  sortable
                />
                <Column
                  field="expiry_date"
                  header="Date d'expiration"
                  sortable
                  body={(rowData: Documents) => (
                    <span className="expiry-date warning">
                      {new Date(rowData.expiry_date).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  )}
                />
              </DataTable>
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card
              title="Documents Expirés à Remplacer"
              subTitle="Documents nécessitant un remplacement immédiat"
              className="fade-in"
              header={
                <div className="flex align-items-center gap-2 mb-3">
                  <i
                    className="pi pi-times-circle"
                    style={{ fontSize: "1.5rem", color: "#EF5350" }}
                  />
                </div>
              }
            >
              <DataTable
                value={stats.expiredDocuments}
                paginator
                rows={5}
                loading={loading}
                emptyMessage="Aucun document expiré"
                responsiveLayout="scroll"
                showGridlines
                stripedRows
                size="small"
              >
                <Column field="doc_number" header="Numéro" sortable />
                <Column field="type.name" header="Type" sortable />
                <Column
                  field="vehicle.licenseplate"
                  header="Véhicule"
                  sortable
                />
                <Column
                  field="expiry_date"
                  header="Date d'expiration"
                  sortable
                  body={(rowData: Documents) => (
                    <span className="expiry-date expired">
                      {new Date(rowData.expiry_date).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  )}
                />
              </DataTable>
            </Card>
          </div>
        </div>
      </div>

      <Toast ref={toast} />
    </div>
  );
}

export default TableauDeBord;
