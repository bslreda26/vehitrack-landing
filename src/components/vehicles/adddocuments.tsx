import { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";
import FileUpload from "../FileUploader/FileUpload";
import { Adddocument, replaceDocument } from "../../apicalls/apicallsDocuments";
import GetDocumentTypes from "../../FormComponents.ts/GetDocumentTypes";
import { Chip } from 'primereact/chip';
import { getVehicleById } from "../../apicalls/apicallsVehicle";
import { Vehicle } from "../../models/Vehicle";
import { Skeleton } from "primereact/skeleton";
function AddDocuments() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [docNumber, setDocNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [issuedAt, setIssuedAt] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const [docNumberError, setDocNumberError] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [issuedAtError, setIssuedAtError] = useState(false);
  const [selectedTypeError, setSelectedTypeError] = useState(false);
  const [documentFileError, setDocumentFileError] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<Vehicle | undefined>()

  const validateForm = () => {
    let hasError = false;

    if (!docNumber) {
      hasError = true;
      setDocNumberError(true);
    } else {
      setDocNumberError(false);
    }

    if (!expiryDate) {
      hasError = true;
      setExpiryDateError(true);
    } else {
      setExpiryDateError(false);
    }

    if (!issuedAt) {
      hasError = true;
      setIssuedAtError(true);
    } else {
      setIssuedAtError(false);
    }

    if (!selectedType) {
      hasError = true;
      setSelectedTypeError(true);
    } else {
      setSelectedTypeError(false);
    }

    if (!documentFile) {
      hasError = true;
      setDocumentFileError(true);
    } else {
      setDocumentFileError(false);
    }

    return !hasError;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (vehicleId && selectedType) {
          await replaceDocument(vehicleId, {
            doc_type_id: selectedType,
            doc_number: docNumber,
            established_at: issuedAt,
            expiry_date: expiryDate,
            file: documentFile ? documentFile : undefined
          });
          
          // Show success toast message
          toast.current?.show({
            severity: 'success',
            summary: 'Document ajouté',
            detail: 'Le document a été ajouté avec succès',
            life: 3000
          });
          
          // Navigate back to the vehicle documents page after a short delay
          setTimeout(() => {
            navigate(`/vehicles/${vehicleId}/documents`);
          }, 1000);
        }
      } catch (error) {
        // Show error toast message
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de l\'ajout du document',
          life: 5000
        });
      }
    }
  };

  const fetchVehicle = async () => {

    setVehicleLoading(true)
    try {

      if (vehicleId) {
        const response = await getVehicleById(parseInt(vehicleId))
        setVehicle(response.data)
      }


    }
    catch (error) {

      alert("Une erreur est survenue lors de la récupération du véhicule")

    }
    finally {
      setVehicleLoading(false)
    }



  }

  useEffect(() => {

    fetchVehicle();

  }, [vehicleId])

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Toast ref={toast} />

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          color: '#1a237e',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>Ajouter un Document</h2>


        <div>
          {vehicleLoading && <Skeleton width="100%" className="mb-2"></Skeleton>}
          {vehicle &&
            <div style={vehicleInfoStyle}>
              <Chip label={vehicle.marque} />
              <Chip label={vehicle.licenseplate} />
            </div>}
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="docNumber" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Numéro du Document*
          </label>
          <InputText
            id="docNumber"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            className={docNumberError ? 'p-invalid' : ''}
            style={{ width: '100%' }}
          />
          {docNumberError && <small className="p-error">Ce champ est requis</small>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="documentType" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Type de Document*
          </label>
          <GetDocumentTypes
            value={selectedType}
            onChange={(value) => setSelectedType(value)}
            className={selectedTypeError ? 'p-invalid' : ''}
          />
          {selectedTypeError && <small className="p-error">Ce champ est requis</small>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="issuedAt" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Date d'émission*
          </label>
          <Calendar
            showOnFocus={false}
            id="issuedAt"
            value={issuedAt}
            onChange={(e) => e.value && setIssuedAt(e.value)}
            dateFormat="dd/mm/yy"
            className={issuedAtError ? 'p-invalid' : ''}
            style={{ width: '100%' }}
          />
          {issuedAtError && <small className="p-error">Ce champ est requis</small>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="expiryDate" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Date d'expiration*
          </label>
          <Calendar
            id="expiryDate"
            showOnFocus={false}
            value={expiryDate}
            onChange={(e) => e.value && setExpiryDate(e.value)}
            dateFormat="dd/mm/yy"
            className={expiryDateError ? 'p-invalid' : ''}
            style={{ width: '100%' }}
          />
          {expiryDateError && <small className="p-error">Ce champ est requis</small>}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="documentFile" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Document Scan*
          </label>
          <FileUpload
            selectedFiles={documentFile ? [documentFile] : []}
            onFilesChange={(files) => setDocumentFile(files[0])}
            onRemoveFile={() => setDocumentFile(null)}
            error={documentFileError}
            maxSelection={1}
          />
          {documentFileError && <small className="p-error">Ce champ est requis</small>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            label="Annuler"
            severity="secondary"
            onClick={() => navigate('/vehicle')}
          />
          <Button
            icon='pi pi-plus'
            label="Ajouter"
            severity="success"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default AddDocuments;
const vehicleInfoStyle = {
  display: "flex",
  flexDirection: "row" as const,
  gap: '1em',
  margin: '1em'
}