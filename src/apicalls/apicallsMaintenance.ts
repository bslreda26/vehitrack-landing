import { AxiosResponse } from "axios";
import AxiosSingleton from "./AxiosInstance";
import { PagedResponse } from "../models/PagedResponse";
import { MaintenanceRecord } from "../models/MaintenanceRecord";

const api = AxiosSingleton.getInstance();

// Add a new maintenance record
export const addMaintenance = (record: MaintenanceRecord): Promise<AxiosResponse<MaintenanceRecord>> => {
  // Convert frontend format to backend format - send all fields
  const payload = {
    vehicle_id: record.vehicleId,
    description: record.description,
    service_provider: record.serviceProvider,
    cost: record.cost ? parseFloat(record.cost.toString()) : 0,
    odometer_reading: record.odometerReading ? parseInt(record.odometerReading.toString()) : 0,
    service_date: record.serviceDate,
    next_service_odometer: record.nextServiceOdometer ? parseInt(record.nextServiceOdometer.toString()) : null,
    next_service_date: record.nextServiceDate || null,
    parts_replaced: record.partsReplaced || null,
    notes: record.notes || null,
    receipt_image: record.receiptImage || null,
    service_type_ids: record.serviceTypes?.map(st => st.id) || []
  };
  return api.post("/addMaintenance", payload);
};

// Update an existing maintenance record
export const updateMaintenance = (id: number, record: MaintenanceRecord): Promise<AxiosResponse<MaintenanceRecord>> => {
  // Convert frontend format to backend format - send all fields
  const payload = {
    id: id,
    vehicle_id: record.vehicleId,
    description: record.description,
    service_provider: record.serviceProvider,
    cost: record.cost ? parseFloat(record.cost.toString()) : 0,
    odometer_reading: record.odometerReading ? parseInt(record.odometerReading.toString()) : 0,
    service_date: record.serviceDate,
    next_service_odometer: record.nextServiceOdometer ? parseInt(record.nextServiceOdometer.toString()) : null,
    next_service_date: record.nextServiceDate || null,
    parts_replaced: record.partsReplaced || null,
    notes: record.notes || null,
    receipt_image: record.receiptImage || null,
    service_type_ids: record.serviceTypes?.map(st => st.id) || []
  };
  return api.put("/updateMaintenance", payload);
};

// Delete a maintenance record
export const deleteMaintenance = (id: number): Promise<AxiosResponse<any>> => {
  return api.post("/deleteMaintenance", { id });
};

// Get all maintenance records
export const getAllMaintenance = (): Promise<AxiosResponse<MaintenanceRecord[]>> => {
  return api.get("/getAllMaintenance");
};

// Get a specific maintenance record by ID
export const getMaintenanceById = (id: number): Promise<AxiosResponse<MaintenanceRecord>> => {
  return api.post("/getMaintenanceById", { id });
};

// Get all maintenance records for a specific vehicle
export const getMaintenanceByVehicleId = (vehicleId: number): Promise<AxiosResponse<MaintenanceRecord[]>> => {
  return api.post("/getMaintenanceByVehicleId", { vehicle_id: vehicleId });
};

// Search maintenance records with filters and pagination
export const getMaintenanceByCriteriaPaged = (
  page: number,
  limit: number,
  vehicleId?: number,
  serviceTypeIds?: number[], // Change from serviceType?: string
  startDate?: string,
  endDate?: string,
  minCost?: number,
  maxCost?: number
): Promise<AxiosResponse<PagedResponse<MaintenanceRecord>>> => {
  return api.post("/getMaintenanceByCriteriaPaged", {
    page,
    limit,
    vehicle_id: vehicleId,
    service_type_ids: serviceTypeIds, // Change from service_type
    from_date: startDate,
    to_date: endDate,
    min_cost: minCost,
    max_cost: maxCost
  });
};

// Calculate total maintenance costs
export const getTotalMaintenanceCost = (
  vehicleId?: number,
  startDate?: string,
  endDate?: string
): Promise<AxiosResponse<{ total_cost: number }>> => {
  return api.post("/getTotalMaintenanceCost", {
    vehicle_id: vehicleId,
    from_date: startDate,
    to_date: endDate
  });
};

// Upload receipt image
export const uploadReceiptImage = (maintenanceId: number, file: File): Promise<AxiosResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('maintenance_id', maintenanceId.toString());

  return api.post('/uploadReceiptImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Download receipt image
export const downloadReceiptImage = (maintenanceId: number): Promise<AxiosResponse<Blob>> => {
  return api.post('/downloadReceiptImage', { maintenance_id: maintenanceId }, {
    responseType: 'blob'
  });
};

// Types de dépenses pour le dropdown
export const SERVICE_TYPES = [
  "Changement huile",
  "Changement pieces",
  "Ammend"
];

// Get service types from API
export const getServiceTypes = (): Promise<AxiosResponse<any>> => {
  return api.get("/service-types");
};

// Service Types API calls
export const createServiceType = (data: { name: string; description?: string }): Promise<AxiosResponse<any>> => {
  return api.post("/service-types", data);
};

export const getAllServiceTypes = (): Promise<AxiosResponse<any>> => {
  return api.get("/service-types");
};

export const updateServiceType = (id: number, data: { name: string; description?: string }): Promise<AxiosResponse<any>> => {
  return api.put(`/service-types/${id}`, data);
};

export const deleteServiceType = (id: number): Promise<AxiosResponse<any>> => {
  return api.delete(`/service-types/${id}`);
};

// Get top vehicles by maintenance cost
export const getTopVehiclesByMaintenanceCost = (limit: number = 5): Promise<AxiosResponse<any>> => {
  return api.get(`/top-vehicles-by-maintenance-cost?limit=${limit}`);
};
