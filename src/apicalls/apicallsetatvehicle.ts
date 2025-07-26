import axios, { AxiosResponse } from "axios";
import { Etatvehicle } from "../models/etatvehicle";
import AxiosSingleton from "./AxiosInstance";
const api = AxiosSingleton.getInstance()
export function getEtatByCriteria(
  name: string
): Promise<AxiosResponse<Etatvehicle[]>> {
  return api.post("/getetatByCriteria", { name });
}



export const addEtat = (name: string) => {
  const response = api.post("/addetat", {name});
  return response;
};


export const getallTypes = (): Promise<AxiosResponse<Etatvehicle[]>> => {
    const response = api.get("/getAlletat");
    return response;
  };

  export const getEtatById = (id:number): Promise<AxiosResponse<Etatvehicle>> => {
    const response = api.post("/getetatById",{id:id});
    return response;
  };

  export const deleteEtat = (id:number) => {
    const response = api.post("/deleteetat",{id:id});
    return response;
  };

  export const updateEtat = (id:number,name:string) => {
    const response = api.put("/updatetat",{id,name});
    return response;
  };
