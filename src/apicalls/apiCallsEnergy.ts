import axios, { AxiosResponse } from "axios";
import { Energy } from "../models/Energy";
import AxiosSingleton from "./AxiosInstance";
const api = AxiosSingleton.getInstance()
export const getAllEnergies = (): Promise<AxiosResponse<Energy[]>> => {
  return api.post("/getAllEnergies");
};
