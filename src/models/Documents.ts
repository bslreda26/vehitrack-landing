import { Chauffeur } from "./Chauffeur"
import { Doctype } from "./Doctype"
import { Vehicle } from "./Vehicle"

export interface Documents {
   
     id: number
  
    
     type_id: number
  
    
     doc_number: string
  
   
     expiry_date: Date
     doc_image: string
  
   
     issued_at: Date

     type: Doctype
     chauffeur: Chauffeur
     vehicle: Vehicle

  
    
  
}