import Companie from "./Companie"
import { Vehicle } from "./Vehicle"

export interface Chauffeur
{
     id: number
     first_name: string 
     last_name: string 
     company_id: number
     vehicle_id: number
     document_id: number  
     createdAt: Date
     updatedAt: Date
    companie:  Companie
    vehicle: Vehicle

    label?: string

    
}