import axios, { AxiosResponse } from "axios";
import { Doctype } from "../models/Doctype";
import AxiosSingleton from "./AxiosInstance";

const api = AxiosSingleton.getInstance()

export const getalldoctypes = (): Promise<AxiosResponse<Doctype[]>> => {
  return api.get("/getAlldocTypes");
};

export const adddoctype = (name: string): Promise<AxiosResponse<Doctype>> => {
  return api.post("/adddoctypes", { name });
};

export const deletedoctype = (id: number): Promise<AxiosResponse<void>> => {
  return api.post(`/deletedocType`,{id});
};

export const updatedoctype = (id: number, name: string): Promise<AxiosResponse<Doctype>> => {
  return api.put(`/updatedocType`,{id,name});
};


export const test = () =>{
  return api.post('/test')
}