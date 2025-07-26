import { Vehicle } from "./Vehicle";

export interface MaintenanceRecord {
  id?: number;
  vehicleId: number; // Changed from vehicle_id
  vehicle?: Vehicle;
  serviceTypes?: Array<{id: number; name: string; description?: string}>; // Changed from service_type_ids
  description: string;
  serviceProvider: string; // Changed from service_provider
  cost: number;
  odometerReading: number; // Changed from odometer_reading
  serviceDate: string; // Changed from service_date - ISO date format
  partsReplaced?: string; // Changed from parts_replaced
  nextServiceDate?: string; // Changed from next_service_date
  nextServiceOdometer?: number; // Changed from next_service_odometer
  notes?: string;
  receiptImage?: string; // Changed from receipt_image
  createdAt?: string; // Changed from created_at
  updatedAt?: string; // Changed from updated_at
}

export interface MaintenanceSummary {
  total_cost: number;
  total_records: number;
  last_service_date?: string;
  next_service_date?: string;
}

export interface MaintenanceFilter {
  vehicle_id?: number;
  service_type?: string;
  from_date?: string;
  to_date?: string;
  min_cost?: number;
  max_cost?: number;
}
