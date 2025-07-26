import axios, { AxiosResponse } from "axios";
import AddVehicle from "../components/vehicles/addVehicle";
import { PagedResponse } from "../models/PagedResponse";
import { Vehicle } from "../models/Vehicle";
import { DocumentDto, VehicleDto } from "./dtos/AddVehicleDtos";
import AxiosSingleton from "./AxiosInstance";
import { Allvehiculedto } from "./dtos/Allvehicledto";
const api = AxiosSingleton.getInstance()

export const addVehicle = (
  vehicleDto: VehicleDto,
  visiteDto: DocumentDto,
  carteGriseDto: DocumentDto,
  transportDto: DocumentDto,
  assuranceDto: DocumentDto,
  patenteDto: DocumentDto,
  stationnementDto: DocumentDto
): Promise<AxiosResponse<Vehicle>> => {
  const formData = new FormData();

  // Append vehicle data
  formData.append('vehicle', JSON.stringify(vehicleDto));

  // Function to append document data and file
  const appendDocument = (name: string, dto: DocumentDto) => {
    const { file, ...documentData } = dto;
    formData.append(`${name}Data`, JSON.stringify(documentData));
    if (file) {
      formData.append(`${name}File`, file);
    }
  };

  // Append all documents

  appendDocument('visite', visiteDto);
  appendDocument('carteGrise', carteGriseDto);
  appendDocument('transport', transportDto);
  appendDocument('assurance', assuranceDto);
  appendDocument('patente', patenteDto);
  appendDocument('stationnement', stationnementDto);


  return api.post("/addvehicle", formData, {

    headers: {

      "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data

    },

  });
};

export const getVehicleByCriteria = (
  licenseplate?: string,
  model?: string,
  vetype_id?: number,
  companie_id?: number,
  etat_id?: number,
  working_company_id?: number,
) => {
  return api.post("getvehicleByCriteria", {
    licenseplate,
    model,
    vetype_id,
    companie_id,
    etat_id,
    working_company_id,
  });
};

export const getVehicleByCriteriaPaged = (
  page: number,
  limit: number,
  licenseplate?: string,
  companyIds?: number[],
  working_company_id?: number
): Promise<AxiosResponse<PagedResponse<Vehicle>>> => {
  // Ensure working_company_id is properly passed if it exists
  const payload = {
    licenseplate,
    page,
    limit,
    companyIds: companyIds || [],
    working_company_id: working_company_id || null
  };
  return api.post("getvehicleByCriteriaPaged", payload);
};

export const getAllVehicles = (working_company_id?: number) : Promise<AxiosResponse<{success: boolean, data: Allvehiculedto[]}>> => {
  return api.get('getAllvehicles', { params: { working_company_id } });
};

export const deleteVehicle = (id: number) => {
  return api.post("/deletevehicle", { id });
};

export interface UpdateVehicleData {
  // owner: string;
  marque?: string;
  licenseplate: string;
  vetype_id: number;
  companie_id: number;
  // etat_id?: number ;
  couleur?: string;
  numero_chassis?: string;
}

export const editVehicle = (vehicle_id: number,
  color: string,
  chassis: string,
  immatriculation: string,
  type_id: number,
  owning_company_id: number,
  working_company_id: number) => {
  return api.put("/updatevehicle", {
    vehicle_id,
    color,
    chassis,
    immatriculation,
    type_id,
    owning_company_id,
    working_company_id

  });
};

export const getVehicleById = (id: number): Promise<AxiosResponse<Vehicle>> => {
  return api.post("/getvehicleById", { id });
};