import React, { useEffect, useRef, useState, useCallback } from "react";
import { Vehicle } from "../../models/Vehicle";
import {
  deleteVehicle,
  getAllVehicles,
  getVehicleByCriteriaPaged,
} from "../../apicalls/apicallsVehicle";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import ScrollTable from "../../FormComponents.ts/ScrollTable";
import { Button } from "primereact/button";
import GetCompanies from "../../FormComponents.ts/GetCompanies";
import { ExportButtons } from "../../utils/FunctionsUtils";

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [licensePlateFilter, setLicensePlateFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  const columns = [
    { accessorKey: "marque", header: "Modèle" },
    { accessorKey: "licenseplate", header: "Plaque d'immatriculation" },
    { accessorKey: "vetypes.name", header: "Type de véhicule" },
    { accessorKey: "working_company.name", header: "Entreprise" },
  ];

  const getNestedValue = (obj: Vehicle, path: string) => {
    const keys = path.split(".");
    let value: any = obj;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key as keyof typeof value];
      } else {
        return undefined;
      }
    }
    return value;
  };

  const table = {
    getHeaderGroups: () => [
      {
        headers: columns.map((col) => ({
          column: { columnDef: { header: col.header } },
        })),
      },
    ],
    getRowModel: () => ({
      rows: vehicles.map((vehicle) => ({
        getVisibleCells: () =>
          columns.map((col) => ({
            getValue: () => getNestedValue(vehicle, col.accessorKey),
          })),
      })),
    }),
  };
  const navigate = useNavigate();
  const location = useLocation();

  const fetchVehicles = React.useCallback(async () => {
    try {
      setLoading(true);
      const working_company_id = selectedCompanies[0]?.id || null;
      // Pass empty array for companyIds since we're using working_company_id
      const response = await getVehicleByCriteriaPaged(
        page,
        20,
        licensePlateFilter,
        [], // Empty array for companyIds since we're using working_company_id
        working_company_id
      );

      if (page === 1) {
        setVehicles(response.data.data);
      } else {
        setVehicles((prevVehicles) => [...prevVehicles, ...response.data.data]);
      }
      setHasMore(response.data.meta.total > page * 20);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch vehicles",
      });
    } finally {
      setLoading(false);
    }
  }, [page, licensePlateFilter, selectedCompanies]);

  useEffect(() => {
    setVehicles([]);
    setPage(1);
    fetchVehicles();
  }, [licensePlateFilter, location.key, selectedCompanies]);

  const fetchVehiclesforexcel = React.useCallback(async () => {
    try {
      // Get the selected company ID if any and pass it as working_company_id
      const working_company_id = selectedCompanies[0]?.id;
      const response = await getAllVehicles(working_company_id);
      return response;
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch vehicles",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedCompanies]);

  useEffect(() => {
    setVehicles([]);
    setPage(1);
    fetchVehicles();
  }, [licensePlateFilter, location.key, selectedCompanies]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (id: number) => {
    try {
      console.log(id);
      setLoading(true);
      const response = await deleteVehicle(id);
      (toast.current as any).show({
        severity: "success",
        summary: "ok",
        detail: "véhicule supprimé",
      });
      setVehicles(
        vehicles.filter((item) => {
          return item.id !== id;
        })
      );
    } catch (error) {
      (toast.current as any).show({
        severity: "error",
        summary: "ok",
        detail: "Echec de la suppression",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    const vehicleToEdit = vehicles.find((v) => v.id === id);
    if (vehicleToEdit) {
      navigate(`/EditVehicle/${id}`);
    } else {
      (toast.current as any).show({
        severity: "error",
        summary: "Error",
        detail: "Vehicle not found",
      });
    }
  };

  const handleAddDocument = (id: number) => {
    navigate(`/vehicles/${id}/add-document`);
  };

  const handleRowClick = (vehicle: any) => {
    if (vehicle.id) {
      navigate(`/vehicles/${vehicle.id}/documents`);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#2c3e50",
            fontSize: "1.75rem",
            fontWeight: 600,
          }}
        >
          Gestion des Voitures
        </h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <ExportButtons
            table={table}
            toast={toast.current}
            columns={columns}
            // fetchfunction={async (page: number, limit: number, searchTerm?: string, companyIds?: number[], working_company_id?: number | null) => {
            //   try {
            //     // Always use the selected company's ID as working_company_id
            //     const effectiveWorkingCompanyId = selectedCompanies[0]?.id || null;
            //     console.log('Fetching with working_company_id:', effectiveWorkingCompanyId);
            //     const response = await getVehicleByCriteriaPaged(
            //       page,
            //       limit,
            //       licensePlateFilter,
            //       [],  // Empty array for companyIds since we're using working_company_id
            //       effectiveWorkingCompanyId
            //     );
            //     console.log('API Response:', response);
            //     return response;
            //   } catch (error) {
            //     console.error('API Error:', error);
            //     throw error;
            //   }
            // }}
            fetchfunction={fetchVehiclesforexcel}
            exportLoading={loading}
          />

          <Button
            label="Ajouter un véhicule"
            icon="pi pi-plus"
            severity="success"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
            }}
            onClick={() => navigate("/addVehicle")}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          padding: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        <GetCompanies
          label="Filtrer par entreprise"
          selectedCompanies={selectedCompanies}
          setSelectedCompanies={setSelectedCompanies}
          maxSelection={1}
        />
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          padding: "1.5rem",
        }}
      >
        <ScrollTable
          style={{
            height: "calc(100vh - 250px)",
            backgroundColor: "white",
            marginTop: "0",
          }}
          value={vehicles}
          headers={[
            "Modèle",
            "Plaque d'immatriculation",
            "Type de véhicule",
            "Entreprise",
          ]}
          fetchFunction={fetchVehicles}
          fields={[
            "marque",
            "licenseplate",
            "vetypes.name",
            "working_company.name",
          ]}
          loading={loading}
          page={page}
          hasMore={hasMore}
          setPage={setPage}
          setHasMore={setHasMore}
          filter
          filterFields={["licenseplate"]}
          filterHandlers={[setLicensePlateFilter]}
          filterValues={[licensePlateFilter]}
          onRowClick={handleRowClick}
        />
      </div>
      <Toast ref={toast} position="bottom-center" />
    </div>
  );
}

export default Vehicles;
