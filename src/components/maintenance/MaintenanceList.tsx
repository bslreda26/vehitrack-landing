import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";

import { MaintenanceRecord } from "../../models/MaintenanceRecord";
import { Vehicle } from "../../models/Vehicle";
import {
  getAllMaintenance,
  getMaintenanceByVehicleId,
  deleteMaintenance,
} from "../../apicalls/apicallsMaintenance";
import GetVehicles from "../../FormComponents.ts/GetVehicles";
import "./maintenance.css";

const MaintenanceList: React.FC = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<MaintenanceRecord | null>(null);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<MaintenanceRecord[]>(
    []
  );

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const dt = useRef<any>(null);

  useEffect(() => {
    loadAllMaintenanceRecords();
  }, []);

  useEffect(() => {
    if (selectedVehicles.length > 0) {
      loadMaintenanceByVehicle(selectedVehicles[0].id);
    } else {
      loadAllMaintenanceRecords();
    }
  }, [selectedVehicles]);

  const loadAllMaintenanceRecords = async () => {
    try {
      setLoading(true);
      const response = await getAllMaintenance();
      // Ensure data is always an array
      const responseData = response.data;

      if (Array.isArray(responseData)) {
        // If response.data is already an array
        setMaintenanceRecords(responseData);
      } else if (responseData && typeof responseData === "object") {
        // If response.data is an object that might contain a data property
        const nestedData = (responseData as any).data;
        if (nestedData && Array.isArray(nestedData)) {
          setMaintenanceRecords(nestedData);
        } else {
          console.warn("Unexpected data structure:", responseData);
          setMaintenanceRecords([]);
        }
      } else {
        console.warn("No valid data returned:", responseData);
        setMaintenanceRecords([]);
      }
    } catch (error) {
      console.error("Error loading all maintenance records:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Chargement des enregistrements échoué",
      });
      setMaintenanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMaintenanceByVehicle = async (vehicleId: number) => {
    try {
      setLoading(true);
      const response = await getMaintenanceByVehicleId(vehicleId);
      // Ensure data is always an array
      const responseData = response.data;

      if (Array.isArray(responseData)) {
        // If response.data is already an array
        setMaintenanceRecords(responseData);
      } else if (responseData && typeof responseData === "object") {
        // If response.data is an object that might contain a data property
        const nestedData = (responseData as any).data;
        if (nestedData && Array.isArray(nestedData)) {
          setMaintenanceRecords(nestedData);
        } else {
          console.warn("Unexpected data structure:", responseData);
          setMaintenanceRecords([]);
        }
      } else {
        console.warn("No valid data returned:", responseData);
        setMaintenanceRecords([]);
      }

      toast.current?.show({
        severity: "success",
        summary: "Filtré",
        detail: `Dépenses pour le véhicule sélectionné`,
        life: 2000,
      });
    } catch (error) {
      console.error("Error loading maintenance by vehicle:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Chargement échoué pour ce véhicule",
      });
      setMaintenanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedVehicles([]);
    loadAllMaintenanceRecords();
    toast.current?.show({
      severity: "info",
      summary: "Filtres effacés",
      detail: "Réinitialisation complète.",
      life: 2000,
    });
  };

  const handleDelete = (id: number) => {
    confirmDialog({
      message: "Confirmer la suppression?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteMaintenance(id);
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Suppression réussie",
          });
          selectedVehicles.length > 0
            ? loadMaintenanceByVehicle(selectedVehicles[0].id)
            : loadAllMaintenanceRecords();
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: "Suppression échouée",
          });
        }
      },
    });
  };

  const exportCSV = () => dt.current?.exportCSV();

  const printSelectedRecords = () => {
    if (selectedRecords.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez sélectionner au moins un enregistrement à imprimer",
        life: 3000,
      });
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible d'ouvrir la fenêtre d'impression",
        life: 3000,
      });
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rapport de Dépenses</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .header h1 { color: #333; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total { font-weight: bold; background-color: #f9f9f9; }
            .summary { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rapport de Dépenses</h1>
            <p>Date d'impression: ${new Date().toLocaleDateString("fr-FR")}</p>
            <p>Nombre d'enregistrements: ${selectedRecords.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Véhicule</th>
                <th>Type de Service</th>
                <th>Prestataire</th>
                <th>Description</th>
                <th>Coût (XOF)</th>
                <th>Kilométrage</th>
              </tr>
            </thead>
            <tbody>
              ${selectedRecords
                .map(
                  (record) => `
                <tr>
                  <td>${formatDate(record.serviceDate)}</td>
                  <td>${getVehicleDisplayName(
                    record.vehicleId,
                    record.vehicle
                  )}</td>
                  <td>${
                    record.serviceTypes && record.serviceTypes.length > 0
                      ? record.serviceTypes.map((st) => st.name).join(", ")
                      : "Non défini"
                  }</td>
                  <td>${record.serviceProvider || "Non renseigné"}</td>
                  <td>${record.description || "Non renseigné"}</td>
                  <td>${formatCurrency(record.cost || 0)}</td>
                  <td>${
                    record.odometerReading
                      ? record.odometerReading.toLocaleString("fr-FR") + " km"
                      : "Non renseigné"
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="summary">
            <h3>Résumé</h3>
            <p><strong>Total des coûts:</strong> ${formatCurrency(
              selectedRecords.reduce(
                (sum, record) => sum + (record.cost || 0),
                0
              )
            )}</p>
            <p><strong>Nombre d'enregistrements:</strong> ${
              selectedRecords.length
            }</p>
            <p><strong>Période:</strong> ${
              selectedRecords.length > 0
                ? `${formatDate(
                    selectedRecords[selectedRecords.length - 1].serviceDate
                  )} - ${formatDate(selectedRecords[0].serviceDate)}`
                : "N/A"
            }</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Auto-print after content is loaded
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };

    toast.current?.show({
      severity: "success",
      summary: "Impression",
      detail: `${selectedRecords.length} enregistrement(s) envoyé(s) à l'impression`,
      life: 3000,
    });
  };
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(v);
  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("fr-FR").format(new Date(d));

  const showDetails = (maintenance: MaintenanceRecord) => {
    setSelectedMaintenance(maintenance);
    setDetailsVisible(true);
  };

  const vehicleMap = useMemo(() => {
    const map = new Map();
    selectedVehicles.forEach((v) =>
      map.set(v.id, `${v.licenseplate} (${v.marque})`)
    );
    return map;
  }, [selectedVehicles]);

  // Function to get vehicle display name
  const getVehicleDisplayName = (vehicleId: number, vehicle?: Vehicle) => {
    if (vehicle) {
      return `${vehicle.licenseplate} (${vehicle.marque})`;
    }
    // Try to get from selected vehicles (filter)
    const selectedVehicle = selectedVehicles.find((v) => v.id === vehicleId);
    if (selectedVehicle) {
      return `${selectedVehicle.licenseplate} (${selectedVehicle.marque})`;
    }
    return `Véhicule #${vehicleId}`;
  };

  // Ensure maintenanceRecords is always an array
  useEffect(() => {
    if (!Array.isArray(maintenanceRecords)) {
      console.warn("maintenanceRecords is not an array:", maintenanceRecords);
      setMaintenanceRecords([]);
    }
  }, [maintenanceRecords]);

  const header = (
    <div className="table-header">
      <div className="p-d-flex p-jc-between p-ai-center">
        <h5>Enregistrements de Dépenses</h5>
        <div className="flex align-items-center gap-2">
          {selectedRecords.length > 0 && (
            <span className="text-sm text-primary font-medium">
              {selectedRecords.length} sélectionné(s)
            </span>
          )}
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Recherche globale"
            />
          </span>
          <Button
            icon="pi pi-print"
            label="Imprimer"
            className="p-button-info p-ml-2"
            onClick={printSelectedRecords}
            disabled={selectedRecords.length === 0}
            tooltip="Imprimer les enregistrements sélectionnés"
          />
          <Button
            icon="pi pi-download"
            label="Exporter"
            className="p-ml-2"
            onClick={exportCSV}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="maintenance-list-container">
      <Toast ref={toast} />

      <div className="p-d-flex p-jc-between p-ai-center page-header">
        <h1>Liste des Dépenses</h1>
        <div>
          <Button
            label="Ajouter"
            icon="pi pi-plus"
            className="p-button-success p-mr-2"
            onClick={() => navigate("/maintenance/add")}
          />
          <Button
            label="Tableau de Bord"
            icon="pi pi-chart-bar"
            className="p-button-outlined p-ml-2"
            onClick={() => navigate("/maintenance")}
          />
        </div>
      </div>

      <Card className="maintenance-card filter-card">
        <div className="filter-grid">
          <div className="filter-item" style={{ width: "100%" }}>
            <GetVehicles
              vehicles={selectedVehicles}
              setVehicles={setSelectedVehicles}
              maxSelection={1}
            />
          </div>
          <div className="filter-actions">
            <Button
              label="Effacer"
              icon="pi pi-times"
              className="p-button-outlined p-button-sm"
              onClick={clearFilters}
            />
          </div>
        </div>
      </Card>

      <Card className="maintenance-card">
        <DataTable
          ref={dt}
          value={maintenanceRecords}
          paginator
          rows={10}
          loading={loading}
          globalFilter={globalFilter}
          emptyMessage="Aucun enregistrement trouvé"
          className="maintenance-table"
          rowsPerPageOptions={[5, 10, 25, 50]}
          header={header}
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords}"
          selection={selectedRecords}
          onSelectionChange={(e) =>
            setSelectedRecords(e.value as MaintenanceRecord[])
          }
          dataKey="id"
          selectionMode="multiple"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            field="serviceDate"
            header="Date"
            body={(row) => formatDate(row.serviceDate)}
            sortable
          />
          <Column
            field="serviceTypes"
            header="Type de Service"
            body={(row) => {
              if (!row.serviceTypes || row.serviceTypes.length === 0) {
                return (
                  <span className="service-type-badge unknown">Non défini</span>
                );
              }
              if (row.serviceTypes.length === 1) {
                return (
                  <span className="service-type-badge single">
                    {row.serviceTypes[0].name}
                  </span>
                );
              }
              return (
                <span className="service-type-badge multiple">
                  {row.serviceTypes.length} types
                </span>
              );
            }}
            sortable
          />
          <Column
            field="vehicleId"
            header="Véhicule"
            body={(row) => (
              <span>{getVehicleDisplayName(row.vehicleId, row.vehicle)}</span>
            )}
            sortable
          />
          <Column field="serviceProvider" header="Prestataire" sortable />
          <Column field="description" header="Description" sortable />
          <Column
            field="cost"
            header="Coût"
            body={(row) => <span>{formatCurrency(row.cost)}</span>}
            sortable
          />
          <Column
            field="odometerReading"
            header="Kilométrage"
            body={(row) => (
              <span>
                {row.odometerReading
                  ? `${row.odometerReading.toLocaleString("fr-FR")} km`
                  : "Non renseigné"}
              </span>
            )}
            sortable
          />

          <Column
            header="Détails"
            body={(row) => (
              <div className="maintenance-details">
                <Button
                  icon="pi pi-eye"
                  rounded
                  text
                  severity="info"
                  onClick={() => showDetails(row)}
                  className="p-button-sm"
                  tooltip="Voir les détails"
                />
              </div>
            )}
            style={{ width: "6rem" }}
          />
          <Column
            body={(row) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="success"
                  onClick={() => navigate(`/maintenance/edit/${row.id}`)}
                  className="p-button-sm"
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  onClick={() => handleDelete(row.id)}
                  className="p-button-sm"
                />
              </div>
            )}
            style={{ width: "8rem" }}
          />
        </DataTable>
      </Card>

      {/* Details Dialog */}
      <Dialog
        visible={detailsVisible}
        onHide={() => setDetailsVisible(false)}
        header="Détails de la Dépense"
        modal
        className="p-fluid"
        style={{ width: "600px" }}
      >
        {selectedMaintenance && (
          <div className="maintenance-details-content">
            <div className="grid">
              <div className="col-12 md:col-6">
                <h4>Informations Générales</h4>
                <div className="detail-item">
                  <strong>Date de Service:</strong>{" "}
                  {formatDate(selectedMaintenance.serviceDate)}
                </div>
                <div className="detail-item">
                  <strong>Véhicule:</strong>{" "}
                  {vehicleMap.get(selectedMaintenance.vehicleId) ||
                    `Véhicule #${selectedMaintenance.vehicleId}`}
                </div>
                <div className="detail-item">
                  <strong>Prestataire:</strong>{" "}
                  {selectedMaintenance.serviceProvider}
                </div>
                <div className="detail-item">
                  <strong>Description:</strong>{" "}
                  {selectedMaintenance.description}
                </div>
              </div>

              <div className="col-12 md:col-6">
                <h4>Détails Techniques</h4>
                <div className="detail-item">
                  <strong>Type(s) de Service:</strong>
                  {selectedMaintenance.serviceTypes?.map((type, index) => (
                    <span key={type.id} className="service-type-badge single">
                      {type.name}
                    </span>
                  ))}
                </div>
                <div className="detail-item">
                  <strong>Coût:</strong>{" "}
                  {formatCurrency(selectedMaintenance.cost)}
                </div>
                <div className="detail-item">
                  <strong>Kilométrage Actuel:</strong>{" "}
                  {selectedMaintenance.odometerReading
                    ? `${selectedMaintenance.odometerReading.toLocaleString(
                        "fr-FR"
                      )} km`
                    : "Non renseigné"}
                </div>
                <div className="detail-item">
                  <strong>Prochain Kilométrage:</strong>{" "}
                  {selectedMaintenance.nextServiceOdometer
                    ? `${selectedMaintenance.nextServiceOdometer.toLocaleString(
                        "fr-FR"
                      )} km`
                    : "Non défini"}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4>Informations Système</h4>
              <div className="detail-item">
                <strong>ID:</strong> {selectedMaintenance.id}
              </div>
              {selectedMaintenance.createdAt && (
                <div className="detail-item">
                  <strong>Créé le:</strong>{" "}
                  {formatDate(selectedMaintenance.createdAt)}
                </div>
              )}
              {selectedMaintenance.updatedAt && (
                <div className="detail-item">
                  <strong>Modifié le:</strong>{" "}
                  {formatDate(selectedMaintenance.updatedAt)}
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default MaintenanceList;
