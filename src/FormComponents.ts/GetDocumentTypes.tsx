import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Doctype } from "../models/Doctype";
import { getalldoctypes } from "../apicalls/apicalldoctype";

interface GetDocumentTypesProps {
  value: number | null;
  onChange: (value: number) => void;
  className?: string;
}

function GetDocumentTypes({ value, onChange, className }: GetDocumentTypesProps) {
  const [documentTypes, setDocumentTypes] = useState<Doctype[]>([]);

  useEffect(() => {
    getalldoctypes()
      .then(response => {
        setDocumentTypes(response.data);
      })
      .catch(error => {
        console.error("Error fetching document types:", error);
      });
  }, []);

  return (
    <Dropdown
      value={value}
      onChange={(e) => onChange(e.value)}
      options={documentTypes}
      optionLabel="name"
      optionValue="id"
      placeholder="Sélectionner un type de document"
      className={className}
      style={{ width: '100%' }}
    />
  );
}

export default GetDocumentTypes;
