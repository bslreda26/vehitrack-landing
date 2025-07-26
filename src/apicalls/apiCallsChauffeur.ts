import axios, { Axios, AxiosResponse } from "axios";
import { Chauffeur } from "../models/Chauffeur";
import { PagedResponse } from "../models/PagedResponse";
import AxiosSingleton from "./AxiosInstance";

const api = AxiosSingleton.getInstance()

export const addChauffeur = (
  first_name: string,
  last_name: string,
  company_id: number,
) => {
  return api.post("addchauffeur", {
    first_name,
    last_name,
    company_id,
  });
};

export const getAllChauffeur = (): Promise<AxiosResponse<Chauffeur[]>> => {
  return api.get("getAllchauffeur");
};

export const getchauffeurById = (id: number) => {
  return api.post("getchauffeurById", { id });
}

export const getChauffeurByCriteria = (
  first_name: string,
  last_name: string,
  companie_name: string
): Promise<AxiosResponse<Chauffeur[]>> => {
  return api.post("getChauffeurByCriteria", {
    first_name,
    last_name,
    companie_name,
  });
};

export const deletechauffeur = (id: number) => {
  return api.post("deletechauffeur", { id: id })
}

export const updatechauffeur = (id: number, first_name: string, last_name: string, company_id: number, ) => {
  return api.put("updatechauffeur", { id, first_name, last_name, company_id })
}

export const getChauffeurByCriteriaPaged =(first_name: string,
  last_name: string,
  companie_name: string,
  page: number,
  limit: number): Promise<AxiosResponse<PagedResponse<Chauffeur>>> => {

  return api.post('getChauffeurByCriteriaPaged', {
    first_name, last_name, companie_name, page, limit
  })

}