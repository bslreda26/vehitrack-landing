import axios, { AxiosResponse } from "axios";
import { LoginResponse } from "../models/LoginResponse";
import AxiosSingleton from "./AxiosInstance";
const api = AxiosSingleton.getInstance()

export const login_user = (
  fullName: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> => {
  const response = api.post("/login", { fullName, password });
  return response;
};

export const addUser = (fullName: string, email: string, password: string,role_id:number) => {
  const response = api.post("/addUser", { fullName, email, password,role_id});
  return response;
};

export const updateUser = (
  id: number,
  fullName: string,
  email: string,
  password: string,
  role_id:number,
) => {
  const response = api.put(`/updateUser`, {
    id,
    fullName,
    email,
    password,
    role_id
  });
  return response;
};

export const deleteUser = (id: number) => {
  const response = api.post(`/deleteUser`, { id: id });
  return response;
};

export const getallusers=()=>{const response=api.get("/getAllUsers");
  return response
}

export const getuser=(id:number)=>{const response=api.post(`/getUserById`,{id:id});
  return response
}


export const checkLoggedIn = () =>{

  return api.get("checkLoggedIn")

}