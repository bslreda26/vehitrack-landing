import Companie from "./Companie"
import { Etatvehicle } from "./etatvehicle"
import { Vetype } from "./Vetype"

export interface Vehicle {

     id: number
     marque: string
     licenseplate: string
     vetype_id: number
     companie_id: number
     createdAt: Date
     updatedAt: Date
     vetypes: Vetype
     companie: Companie
     owner: string
     etat_id: number
     etat: Etatvehicle
     label: string
     couleur: string
     numero_chassis: string
     working_company_id: number
     working_company: Companie
     
     // Properties for maintenance components
     make: string           // Alias for marque
     model: string          // Can be derived from vetypes or label
     year: number           // Manufacturing year
     vin: string            // Vehicle identification number (alias for numero_chassis)

     //label does not exist on the backend

}

