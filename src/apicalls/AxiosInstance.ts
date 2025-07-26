import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Vous pouvez modifier cette URL pour qu'elle corresponde à votre environnement
// Par exemple : 'http://api.votredomaine.com' pour la production
const API_BASE_URL = 'http://localhost:3333';

class AxiosSingleton {
  // Private static variable to hold the instance
  private static instance: AxiosSingleton | null = null;

  // Axios instance
  private axiosInstance: AxiosInstance;

  // Private constructor to prevent instantiation
  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
      timeout: 10000, // Timeout après 10 secondes
    });
    
    // Ajouter un intercepteur pour gérer les erreurs
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  // Static method to get the instance
  public static getInstance(): AxiosInstance {
    if (!AxiosSingleton.instance) {
      AxiosSingleton.instance = new AxiosSingleton();
    }
    return AxiosSingleton.instance.axiosInstance;
  }

  public request(config: AxiosRequestConfig) {

    return this.axiosInstance.request(config);

  }
}



export default AxiosSingleton;