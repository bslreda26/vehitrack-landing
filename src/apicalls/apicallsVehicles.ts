import AxiosSingleton from './AxiosInstance';

const api = AxiosSingleton.getInstance();

export const getAllVehicles = () => {
  return api.get('/vehicles');
};

export const getVehicleById = (id: number) => {
  return api.get(`/vehicles/${id}`);
};

export const createVehicle = (data: any) => {
  return api.post('/vehicles', data);
};

export const updateVehicle = (id: number, data: any) => {
  return api.put(`/vehicles/${id}`, data);
};

export const deleteVehicle = (id: number) => {
  return api.delete(`/vehicles/${id}`);
};
