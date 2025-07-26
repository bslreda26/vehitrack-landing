export type VehicleDto = {

  working_at: number | null//company id
  marque: string
  energy_id ?: number  | null
  type_id: number
  numero_chassis: string
  licenseplate: string
  couleur?: string
  companie_id: number | null
}

export type DocumentDto={
  established_at?: Date | null
  expiry_date?: Date | null
  doc_number?: string
  doc_type_id: number
  file?: File
}