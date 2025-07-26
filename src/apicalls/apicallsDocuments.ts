import axios, { AxiosResponse } from "axios";
import { Documents } from "../models/Documents";
import { PagedResponse } from "../models/PagedResponse";
import { Doctype } from "../models/Doctype";
import AxiosSingleton from "./AxiosInstance";
import { DocumentDto } from "./dtos/AddVehicleDtos";
import { Saturation } from "@mantine/core/lib/ColorPicker/Saturation/Saturation";

const api = AxiosSingleton.getInstance()
export const getAllDocuments = (): Promise<AxiosResponse<Documents[]>> => {

  return api.get("/getAlldocument")
}
export const deltedocument = (id: number): Promise<AxiosResponse<Documents>> => {
  return api.post("/deletedocument", { id });
};

export const getdocumentsByCriteriaPaged = (
  page: number,
  limit: number,
  doc_number?: string,
  type_id?: number,
  vehicle_id?: number,

): Promise<AxiosResponse<PagedResponse<Documents>>> => {
  return api.post("/getdocumentsByCriteriaPaged", {
    page,
    limit,
    doc_number,
    type_id,
    vehicle_id
  });
};


export const Adddocument = (doc_number: string, expiry_date: Date, issued_at: Date, type_id: number, vehicle_id?: number, chauffeur_id?: number,)
  : Promise<AxiosResponse<Documents>> => {
  return api.post("/adddocument", {
    doc_number,
    expiry_date,
    issued_at,
    type_id,
    vehicle_id,
    chauffeur_id,
    archive_old: true
  });
};

export const updatedocument = (id: number, first_name: string, last_name: string, company_id: number, vehicle_id: number) => {
  return api.put("/updatedocument", { id, first_name, last_name, company_id, vehicle_id })
}

export const updateDocument = async (
  id: number,
  document_number: string,
  expiration_date: Date,
  type_id: number,
  vehicle_id?: number,
  chauffeur_id?: number
) => {
  try {
    const response = await api.put(`/document/${id}`, {
      document_number,
      expiration_date,
      type_id,
      vehicle_id,
      chauffeur_id,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadDocumentFile = async (id: number, file: File): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', id.toString());

  return api.post('/uploaddocument', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getdocumentById = (id: number): Promise<AxiosResponse<Documents[]>> => {
  return api.post("/getdocumentById", { id });
};

export const getAllDocumentTypes = (): Promise<AxiosResponse<Doctype[]>> => {
  return api.get("/getAlldocumenttypes");
};


export const replaceDocument = (vehicleID: string,
  document: DocumentDto
) => {
  const formData = new FormData();

  // Append vehicle data
  formData.append('vehicle', JSON.stringify({
    vehicle_id: vehicleID
  }));


  // Function to append document data and file
  const appendDocument = (name: string, dto: DocumentDto) => {
    const { file, ...documentData } = dto;
    formData.append(`${name}Data`, JSON.stringify(documentData));
    if (file) {
      formData.append(`${name}File`, file);
    }
  };

  // Append all documents

  appendDocument('document', document);



  return api.post("/replaceDocument", formData, {

    headers: {

      "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data

    },

  });
}

export const downloadDocument = (document_id: number) => {

  return api.post('downloadDocument', {
    document_id: document_id
  }, {

    responseType: 'blob' // Set the response type to blob

  })


}
export const getdocumentsByCriteria = (document_number: string| undefined,
  type_id: number | undefined,
  status: number, 
  number_of_days: number = 15,
  vehicle_id: number | undefined,
  page = 1, limit = 100): Promise<AxiosResponse<PagedResponse<Documents>>> => {

  return api.post('getdocumentsByCriteria', {
    document_number,
    type_id,
    status,
    number_of_days, 
    vehicle_id,
    page,
    limit
  })

}