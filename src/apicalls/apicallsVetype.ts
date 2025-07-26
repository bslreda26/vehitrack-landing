import { AxiosResponse } from "axios";
import { Vetype } from "../models/Vetype";
import AxiosSingleton from "./AxiosInstance";

const api = AxiosSingleton.getInstance();

export function getVetypeByCriteria(
  name: string
): Promise<AxiosResponse<Vetype[]>> {
  return api.post("/getVetypeByCretiria", { name });
}

export const addType = (name: string) => {
  const response = api.post("/addVetype", {name});
  return response;
};

export const getallTypes = (): Promise<AxiosResponse<Vetype[]>> => {
    const response = api.get("/getAllVetypes");
    return response;
};

export const getVetypesById = (id:number): Promise<AxiosResponse<Vetype>> => {
    const response = api.post("/getVetypeById",{id:id});
    return response;
};

export const deleteVetype = (id:number) => {
    const response = api.post("/deleteVetype",{id:id});
    return response;
};

export const updateVetype = (id:number,name:string) => {
    const response = api.put("/updateVetype",{id,name});
    return response;
};
