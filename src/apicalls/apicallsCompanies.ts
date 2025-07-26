import AxiosSingleton from "./AxiosInstance";

const api = AxiosSingleton.getInstance()

export const getAllCompanies = () => {
  return api.get('/companies');
};

export const getCompaniesByCriteria = (name: string) => {
  return api.post("/getcompaniesByCriteria", { name });
};

export const addCompany = (name: string) =>{

  return api.post('/addcompanie',{name})

}


export const deleteCompany = (id: number) =>{

  return api.post('/deletecompanie', {id:id})

}


export const updateCompany = (id:number, name: string) =>{

  return api.put('/updatecompanie', {id, name})

}