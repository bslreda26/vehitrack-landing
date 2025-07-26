import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Chart } from "primereact/chart";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import {
  getAllMaintenance,
  getTotalMaintenanceCost,
  getAllServiceTypes,
} from "../../apicalls/apicallsMaintenance";
import { MaintenanceRecord } from "../../models/MaintenanceRecord";
import GetVehicles from "../../FormComponents.ts/GetVehicles";
import { Vehicle } from "../../models/Vehicle";
import "./maintenance.css";

interface DashboardStats {
  totalRecords: number;
  totalCost: number;
  averageCost: number;
  recentServicesCount: number;
  thisMonthCost: number;
  lastMonthCost: number;
}

interface DashboardFilters {
  vehicleId?: number;
  startDate?: Date;
  endDate?: Date;
}

interface ServiceTypeStats {
  [key: string]: {
    count: number;
    totalCost: number;
    name: string;
  };
}

const MaintenanceDashboard: React.FC = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRecords: 0,
    totalCost: 0,
    averageCost: 0,
    recentServicesCount: 0,
    thisMonthCost: 0,
    lastMonthCost: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [recentRecords, setRecentRecords] = useState<MaintenanceRecord[]>([]);
  const [serviceTypeStats, setServiceTypeStats] = useState<ServiceTypeStats>(
    {}
  );
  const [chartData, setChartData] = useState<any>({});
  const [chartOptions, setChartOptions] = useState<any>({});

  // Filter states
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>(
    []
  );

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
    loadServiceTypes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    maintenanceRecords,
    selectedVehicles,
    startDate,
    endDate,
    selectedServiceType,
  ]);

  const loadServiceTypes = async () => {
    try {
      const response = await getAllServiceTypes();
      if (Array.isArray(response.data)) {
        setServiceTypes(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setServiceTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error loading service types:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAllMaintenance();

      // Handle different response formats
      let records: MaintenanceRecord[] = [];
      const responseData = response.data as any;

      if (Array.isArray(responseData)) {
        records = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        records = responseData.data;
      }

      setMaintenanceRecords(records);
      // Initial data without filters
      calculateStats(records);
      setRecentRecords(records.slice(0, 5));
      calculateServiceTypeStats(records);
      setupChartData(records);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec du chargement des données du tableau de bord",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records: MaintenanceRecord[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalCost = records.reduce(
      (sum, record) => sum + (record.cost || 0),
      0
    );
    const thisMonthRecords = records.filter(
      (record) => new Date(record.serviceDate) >= thisMonth
    );
    const lastMonthRecords = records.filter((record) => {
      const date = new Date(record.serviceDate);
      return date >= lastMonth && date <= lastMonthEnd;
    });
    const recentRecords = records.filter(
      (record) => new Date(record.serviceDate) >= thirtyDaysAgo
    );

    const thisMonthCost = thisMonthRecords.reduce(
      (sum, record) => sum + (record.cost || 0),
      0
    );
    const lastMonthCost = lastMonthRecords.reduce(
      (sum, record) => sum + (record.cost || 0),
      0
    );

    setStats({
      totalRecords: records.length,
      totalCost,
      averageCost: records.length > 0 ? totalCost / records.length : 0,
      recentServicesCount: recentRecords.length,
      thisMonthCost,
      lastMonthCost,
    });
  };

  const calculateServiceTypeStats = (records: MaintenanceRecord[]) => {
    const stats: ServiceTypeStats = {};

    records.forEach((record) => {
      if (record.serviceTypes && record.serviceTypes.length > 0) {
        record.serviceTypes.forEach((serviceType) => {
          const key = serviceType.id.toString();
          if (!stats[key]) {
            stats[key] = {
              count: 0,
              totalCost: 0,
              name: serviceType.name,
            };
          }
          stats[key].count += 1;
          stats[key].totalCost += record.cost || 0;
        });
      }
    });

    setServiceTypeStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...maintenanceRecords];

    // Filter by vehicle
    if (selectedVehicles.length > 0) {
      const selectedVehicleIds = selectedVehicles.map((v) => v.id);
      filtered = filtered.filter((record) =>
        selectedVehicleIds.includes(record.vehicleId)
      );
    }

    // Filter by service type
    if (selectedServiceType) {
      filtered = filtered.filter((record) =>
        record.serviceTypes?.some((st) => st.id === selectedServiceType.id)
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(
        (record) => new Date(record.serviceDate) >= startDate
      );
    }

    if (endDate) {
      // Set end time to end of day for proper comparison
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (record) => new Date(record.serviceDate) <= endOfDay
      );
    }

    setFilteredRecords(filtered);

    // Update stats and charts with filtered data
    calculateStats(filtered);
    setRecentRecords(filtered.slice(0, 5));
    calculateServiceTypeStats(filtered);
    setupChartData(filtered);
  };

  const clearFilters = () => {
    setSelectedVehicles([]);
    setStartDate(null);
    setEndDate(null);
    setSelectedServiceType(null);
  };

  const setupChartData = (records: MaintenanceRecord[]) => {
    // Monthly cost trend (last 6 months)
    const months = [];
    const costs = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthRecords = records.filter((record) => {
        const recordDate = new Date(record.serviceDate);
        return recordDate >= date && recordDate <= monthEnd;
      });

      const monthCost = monthRecords.reduce(
        (sum, record) => sum + (record.cost || 0),
        0
      );

      months.push(
        date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
      );
      costs.push(monthCost);
    }

    // Service types pie chart - calculate directly from records with costs
    const serviceTypeData: {
      [key: string]: {
        name: string;
        count: number;
        totalCost: number;
        avgCost: number;
      };
    } = {};

    // Calculate service type statistics directly with costs
    records.forEach((record) => {
      if (record.serviceTypes && record.serviceTypes.length > 0) {
        record.serviceTypes.forEach((serviceType) => {
          const key = serviceType.id.toString();
          if (!serviceTypeData[key]) {
            serviceTypeData[key] = {
              name: serviceType.name,
              count: 0,
              totalCost: 0,
              avgCost: 0,
            };
          }
          serviceTypeData[key].count += 1;
          serviceTypeData[key].totalCost += record.cost || 0;
        });
      }
    });

    // Calculate average costs
    Object.keys(serviceTypeData).forEach((key) => {
      if (serviceTypeData[key].count > 0) {
        serviceTypeData[key].avgCost =
          serviceTypeData[key].totalCost / serviceTypeData[key].count;
      }
    });

    const serviceLabels: string[] = [];
    const serviceCounts: number[] = [];
    const serviceCosts: number[] = [];

    // Enhanced color palette with gradients
    const enhancedColors = [
      "#4F46E5", // Indigo
      "#10B981", // Emerald
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#8B5CF6", // Violet
      "#06B6D4", // Cyan
      "#84CC16", // Lime
      "#F97316", // Orange
      "#EC4899", // Pink
      "#6366F1", // Blue
    ];

    // Sort by count for better visualization
    const sortedServiceTypes = Object.values(serviceTypeData).sort(
      (a, b) => b.count - a.count
    );

    sortedServiceTypes.forEach((stat) => {
      serviceLabels.push(stat.name);
      serviceCounts.push(stat.count);
      serviceCosts.push(stat.totalCost);
    });

    const totalServices = serviceCounts.reduce((sum, count) => sum + count, 0);

    setChartData({
      costTrend: {
        labels: months,
        datasets: [
          {
            label: "Coût Mensuel (XOF)",
            data: costs,
            borderColor: "#3f51b5",
            backgroundColor: "rgba(63, 81, 181, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      serviceTypes: {
        labels: serviceLabels,
        datasets: [
          {
            label: "Nombre de Services",
            data: serviceCounts,
            backgroundColor: enhancedColors.slice(0, serviceLabels.length),
            borderColor: enhancedColors
              .slice(0, serviceLabels.length)
              .map((color) => color + "80"),
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
      serviceTypeCosts: {
        labels: serviceLabels,
        datasets: [
          {
            label: "Coût par Type (XOF)",
            data: serviceCosts,
            backgroundColor: enhancedColors
              .slice(0, serviceLabels.length)
              .map((color) => color + "20"),
            borderColor: enhancedColors.slice(0, serviceLabels.length),
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverOffset: 8,
          },
        ],
      },
    });

    setChartOptions({
      costTrend: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  minimumFractionDigits: 0,
                }).format(value);
              },
            },
          },
        },
      },
      serviceTypes: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            align: "center",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 8,
              font: {
                size: 10,
                weight: "400",
              },
              generateLabels: function (chart: any) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label: string, i: number) => {
                    const count = data.datasets[0].data[i];
                    const percentage =
                      totalServices > 0
                        ? ((count / totalServices) * 100).toFixed(1)
                        : "0";
                    return {
                      text: `${label} (${percentage}%)`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].borderColor[i],
                      lineWidth: 1,
                      hidden: false,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const label = context.label || "";
                const value = context.raw || 0;
                const percentage =
                  totalServices > 0
                    ? ((value / totalServices) * 100).toFixed(1)
                    : "0";
                return `${label}: ${value} services (${percentage}%)`;
              },
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#4F46E5",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            usePointStyle: true,
          },
        },
        elements: {
          arc: {
            borderWidth: 2,
          },
        },
        interaction: {
          intersect: false,
        },
      },
      serviceTypeCosts: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            align: "center",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 8,
              font: {
                size: 10,
                weight: "400",
              },
              generateLabels: function (chart: any) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label: string, i: number) => {
                    const cost = data.datasets[0].data[i];
                    const formattedCost = new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                      minimumFractionDigits: 0,
                    }).format(cost);
                    return {
                      text: `${label} (${formattedCost})`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].borderColor[i],
                      lineWidth: 2,
                      hidden: false,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const label = context.label || "";
                const value = context.raw || 0;
                const formattedValue = new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  minimumFractionDigits: 0,
                }).format(value);
                return `${label}: ${formattedValue}`;
              },
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#10B981",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            usePointStyle: true,
          },
        },
        elements: {
          arc: {
            borderWidth: 2,
          },
        },
        interaction: {
          intersect: false,
        },
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getNextOilChangeInfo = () => {
    if (!selectedServiceType || selectedVehicles.length === 0) return null;

    // Find the most recent service for the selected vehicle and service type
    const serviceRecords = filteredRecords.filter(
      (record) =>
        record.serviceTypes?.some((st) => st.id === selectedServiceType.id) &&
        selectedVehicles.some((v) => v.id === record.vehicleId)
    );

    if (serviceRecords.length === 0) return null;

    // Sort by date to get the most recent
    const mostRecent = serviceRecords.sort(
      (a, b) =>
        new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
    )[0];

    // Get the last next_service_odometer value
    const lastOdometer = mostRecent.odometerReading || 0;
    const lastNextServiceOdometer = mostRecent.nextServiceOdometer;

    const nextServiceInfo = {
      lastServiceDate: mostRecent.serviceDate,
      lastServiceOdometer: lastOdometer,
      nextServiceOdometer: lastNextServiceOdometer, // This is the last next_service_odometer
      serviceType: selectedServiceType.name,
      vehicle: selectedVehicles[0],
    };

    return nextServiceInfo;
  };

  const getTrendIndicator = () => {
    if (stats.lastMonthCost === 0) return null;

    const percentChange =
      ((stats.thisMonthCost - stats.lastMonthCost) / stats.lastMonthCost) * 100;
    const isIncrease = percentChange > 0;
    const isSignificant = Math.abs(percentChange) > 5;

    return (
      <div
        className={`stat-trend ${
          isIncrease ? "up" : percentChange < 0 ? "down" : "stable"
        }`}
      >
        <i className={`pi pi-arrow-${isIncrease ? "up" : "down"}`} />
        {Math.abs(percentChange).toFixed(1)}% vs mois dernier
      </div>
    );
  };

  const vehicleBodyTemplate = (rowData: MaintenanceRecord) => {
    return rowData.vehicle
      ? `${rowData.vehicle.licenseplate} (${rowData.vehicle.marque})`
      : `Véhicule #${rowData.vehicleId}`;
  };

  const serviceTypeBodyTemplate = (rowData: MaintenanceRecord) => {
    if (!rowData.serviceTypes || rowData.serviceTypes.length === 0) {
      return <span className="service-type-badge unknown">Non défini</span>;
    }

    if (rowData.serviceTypes.length === 1) {
      return (
        <span className="service-type-badge single">
          {rowData.serviceTypes[0].name}
        </span>
      );
    }

    return (
      <span className="service-type-badge multiple">
        {rowData.serviceTypes.length} types
      </span>
    );
  };

  const actionBodyTemplate = (rowData: MaintenanceRecord) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="success"
          size="small"
          onClick={() => navigate(`/maintenance/edit/${rowData.id}`)}
          tooltip="Modifier"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="maintenance-container">
      <Toast ref={toast} />

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="maintenance-title">Tableau de Bord - Dépenses</h1>
        </div>
        <div className="header-actions">
          <Button
            label="Nouvelle Dépense"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => navigate("/maintenance/add")}
          />
          <Button
            label="Liste Complète"
            icon="pi pi-list"
            className="p-button-outlined"
            onClick={() => navigate("/maintenance/list")}
          />
        </div>
      </div>

      {/* Filters */}
      <Card className="filter-card mb-4">
        <div className="filter-grid">
          <div className="filter-item">
            <GetVehicles
              vehicles={selectedVehicles}
              setVehicles={setSelectedVehicles}
              maxSelection={5}
            />
          </div>

          <div className="filter-item">
            <label
              htmlFor="start-date"
              className="block text-900 font-medium mb-2"
            >
              Date de Début
            </label>
            <Calendar
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.value || null)}
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Sélectionner une date"
            />
          </div>

          <div className="filter-item">
            <label
              htmlFor="end-date"
              className="block text-900 font-medium mb-2"
            >
              Date de Fin
            </label>
            <Calendar
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.value || null)}
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Sélectionner une date"
            />
          </div>

          <div className="filter-item">
            <label
              htmlFor="service-type-filter"
              className="block text-900 font-medium mb-2"
            >
              Type de Service
            </label>
            <Dropdown
              id="service-type-filter"
              value={selectedServiceType}
              options={serviceTypes}
              onChange={(e) => setSelectedServiceType(e.value)}
              optionLabel="name"
              placeholder="Sélectionner un type"
              className="w-full"
            />
          </div>

          <div className="filter-actions">
            <Button
              label="Effacer Filtres"
              icon="pi pi-times"
              className="p-button-outlined p-button-sm"
              onClick={clearFilters}
              disabled={
                selectedVehicles.length === 0 &&
                !startDate &&
                !endDate &&
                !selectedServiceType
              }
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedVehicles.length > 0 ||
          startDate ||
          endDate ||
          selectedServiceType) && (
          <div className="active-filters mt-3 pt-3 border-top-1 border-200">
            <div className="flex align-items-center gap-2 text-600">
              <i className="pi pi-filter" />
              <span className="font-medium">Filtres actifs:</span>

              {selectedVehicles.length > 0 && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 border-round text-sm">
                  {selectedVehicles.length} véhicule(s)
                </span>
              )}

              {selectedServiceType && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 border-round text-sm">
                  Type: {selectedServiceType.name}
                </span>
              )}

              {startDate && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 border-round text-sm">
                  Depuis: {startDate.toLocaleDateString("fr-FR")}
                </span>
              )}

              {endDate && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 border-round text-sm">
                  Jusqu'au: {endDate.toLocaleDateString("fr-FR")}
                </span>
              )}

              <span className="text-500">
                ({filteredRecords.length} sur {maintenanceRecords.length}{" "}
                enregistrement(s))
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <Card className="stat-card modern-stat-card">
          <div className="stat-content">
            <div className="stat-icon">
              <i className="pi pi-wrench" />
            </div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalRecords}</div>
              <div className="stat-label">Total Dépenses</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card modern-stat-card">
          <div className="stat-content">
            <div className="stat-icon">
              <i className="pi pi-wallet" />
            </div>
            <div className="stat-details">
              <div className="stat-value">
                {formatCurrency(stats.totalCost)}
              </div>
              <div className="stat-label">Coût Total</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card modern-stat-card">
          <div className="stat-content">
            <div className="stat-icon trend-icon">
              <i className="pi pi-calendar" />
            </div>
            <div className="stat-details">
              <div className="stat-value">
                {formatCurrency(stats.thisMonthCost)}
              </div>
              <div className="stat-label">Ce Mois</div>
              {getTrendIndicator()}
            </div>
          </div>
        </Card>
      </div>

      {/* Next Service Information Card - Only for Oil Change */}
      {getNextOilChangeInfo() &&
        selectedServiceType?.name?.toLowerCase().includes("huile") && (
          <Card className="next-service-card mb-4">
            <div className="flex align-items-center justify-content-between">
              <div className="flex align-items-center gap-3">
                <div className="next-service-icon">
                  <i className="pi pi-gauge" />
                </div>
                <div>
                  <h3 className="m-0 text-primary">
                    Prochain Changement d'Huile
                  </h3>
                  <p className="text-600 mt-1 mb-0">
                    {selectedVehicles[0]?.licenseplate} -{" "}
                    {selectedVehicles[0]?.marque}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {getNextOilChangeInfo()?.nextServiceOdometer
                    ? getNextOilChangeInfo()?.nextServiceOdometer?.toLocaleString(
                        "fr-FR"
                      ) + " km"
                    : "Non enregistré"}
                </div>
                <div className="text-sm text-600">
                  Dernier next_service_odometer:{" "}
                  {getNextOilChangeInfo()?.lastServiceOdometer?.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  km
                </div>
                <div className="text-xs text-600 mt-1">
                  {formatDate(getNextOilChangeInfo()?.lastServiceDate || "")}
                </div>
              </div>
            </div>
          </Card>
        )}

      {/* Charts */}
      <div className="charts-grid">
        <Card className="chart-card">
          <h3>Évolution des Coûts (6 derniers mois)</h3>
          <div className="chart-container">
            {chartData.costTrend ? (
              <Chart
                type="line"
                data={chartData.costTrend}
                options={chartOptions.costTrend}
              />
            ) : (
              <div className="chart-placeholder">
                <i
                  className="pi pi-chart-line"
                  style={{ fontSize: "3rem", color: "#ccc" }}
                />
                <p>Chargement du graphique...</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="chart-card">
          <div className="flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="m-0">Répartition par Type de Service</h3>
              <p className="text-600 mt-1 mb-0">
                Analyse des services par nombre et coût
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-600">Total Services</div>
              <div className="text-2xl font-bold text-900">
                {filteredRecords.length || maintenanceRecords.length}
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="col-12 lg:col-6">
              <div className="text-center mb-2">
                <h4 className="text-primary font-semibold m-0 text-base">
                  Par Nombre de Services
                </h4>
              </div>
              <div style={{ height: "280px", position: "relative" }}>
                {chartData.serviceTypes &&
                chartData.serviceTypes.labels.length > 0 ? (
                  <Chart
                    type="doughnut"
                    data={chartData.serviceTypes}
                    options={chartOptions.serviceTypes}
                    style={{ height: "100%" }}
                  />
                ) : (
                  <div className="chart-placeholder" style={{ height: "100%" }}>
                    <i
                      className="pi pi-chart-pie"
                      style={{ fontSize: "3rem", color: "#ccc" }}
                    />
                    <p>Aucune donnée disponible</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 lg:col-6">
              <div className="text-center mb-2">
                <h4 className="text-primary font-semibold m-0 text-base">
                  Par Coût Total (XOF)
                </h4>
              </div>
              <div style={{ height: "280px", position: "relative" }}>
                {chartData.serviceTypeCosts &&
                chartData.serviceTypeCosts.labels.length > 0 ? (
                  <Chart
                    type="doughnut"
                    data={chartData.serviceTypeCosts}
                    options={chartOptions.serviceTypeCosts}
                    style={{ height: "100%" }}
                  />
                ) : (
                  <div className="chart-placeholder" style={{ height: "100%" }}>
                    <i
                      className="pi pi-chart-pie"
                      style={{ fontSize: "3rem", color: "#ccc" }}
                    />
                    <p>Aucune donnée disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Statistics Table */}
          {chartData.serviceTypes &&
            chartData.serviceTypes.labels.length > 0 && (
              <div className="mt-4 pt-4 border-top-1 border-200">
                <h4 className="text-900 mb-3">Résumé par Type de Service</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary-50">
                        <th className="text-left p-2 border border-200 font-semibold text-primary">
                          Type de Service
                        </th>
                        <th className="text-center p-2 border border-200 font-semibold text-primary">
                          Nombre
                        </th>
                        <th className="text-center p-2 border border-200 font-semibold text-primary">
                          %
                        </th>
                        <th className="text-right p-2 border border-200 font-semibold text-primary">
                          Coût Total
                        </th>
                        <th className="text-right p-2 border border-200 font-semibold text-primary">
                          Coût Moyen
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.serviceTypes.labels.map(
                        (label: string, index: number) => {
                          const count =
                            chartData.serviceTypes.datasets[0].data[index];
                          const totalCost =
                            chartData.serviceTypeCosts?.datasets[0].data[
                              index
                            ] || 0;
                          const percentage = (
                            (count /
                              (filteredRecords.length ||
                                maintenanceRecords.length)) *
                            100
                          ).toFixed(1);
                          const avgCost = count > 0 ? totalCost / count : 0;
                          const color =
                            chartData.serviceTypes.datasets[0].backgroundColor[
                              index
                            ];

                          return (
                            <tr key={label} className="hover:bg-gray-50">
                              <td className="p-2 border border-200">
                                <div className="flex align-items-center gap-2">
                                  <div
                                    className="w-3 h-3 border-round flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="font-medium">{label}</span>
                                </div>
                              </td>
                              <td className="text-center p-2 border border-200 font-semibold">
                                {count}
                              </td>
                              <td className="text-center p-2 border border-200">
                                <span className="bg-primary-100 text-primary-700 px-2 py-1 border-round text-sm">
                                  {percentage}%
                                </span>
                              </td>
                              <td className="text-right p-2 border border-200 font-semibold">
                                {formatCurrency(totalCost)}
                              </td>
                              <td className="text-right p-2 border border-200">
                                {formatCurrency(avgCost)}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </Card>
      </div>

      {/* Recent Dépenses Records */}
      <Card className="table-card">
        <div className="flex justify-content-between align-items-center mb-4">
          <h3>Dépenses Récentes</h3>
          <Button
            label="Voir Tout"
            icon="pi pi-arrow-right"
            className="p-button-text"
            onClick={() => navigate("/maintenance/list")}
          />
        </div>

        <DataTable
          value={recentRecords}
          responsiveLayout="scroll"
          emptyMessage="Aucune dépense récente"
          className="recent-table"
        >
          <Column
            field="serviceDate"
            header="Date"
            body={(rowData) => formatDate(rowData.serviceDate)}
            sortable
          />
          <Column
            field="vehicle"
            header="Véhicule"
            body={vehicleBodyTemplate}
          />
          <Column
            field="serviceTypes"
            header="Type de Service"
            body={serviceTypeBodyTemplate}
          />
          <Column field="serviceProvider" header="Prestataire" />
          <Column
            field="cost"
            header="Coût"
            body={(rowData) => formatCurrency(rowData.cost || 0)}
            sortable
          />
          <Column body={actionBodyTemplate} style={{ width: "120px" }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default MaintenanceDashboard;
