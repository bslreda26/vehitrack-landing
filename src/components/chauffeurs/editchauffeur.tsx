import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import GetCompanies from "../../FormComponents.ts/GetCompanies";
import Companie from "../../models/Companie";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { getchauffeurById, updatechauffeur } from "../../apicalls/apiCallsChauffeur";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";
import { Vehicle } from "../../models/Vehicle";
import GetVehicles from "../../FormComponents.ts/GetVehicles";

function Editchauffeur() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useRef<Toast>(null);

  const [lastname, setLastname] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [selectedCompanies, setSelectedCompanies] = useState<Companie[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchChauffeur(parseInt(id));
    }
  }, [id]);

  const fetchChauffeur = async (chauffeurId: number) => {
    try {
      setLoading(true);
      const response = await getchauffeurById(chauffeurId);
      const chauffeurData = response.data;
      
      // Update all form fields with the fetched data
      setLastname(chauffeurData.last_name || "");
      setFirstname(chauffeurData.first_name || "");
      setSelectedCompanies(chauffeurData.companie ? [chauffeurData.companie] : []);
      setSelectedVehicle(chauffeurData.vehicle ? [chauffeurData.vehicle] : []);
    } catch (error) {
      console.error("Error fetching chauffeur:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load chauffeur data",
      });
      navigate("/chauffeur");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChauffeur = async () => {
    if (!lastname) {
      setErrorMessage("Le nom est obligatoire");
      return;
    }

    if (!firstname) {
      setErrorMessage("Le prénom est obligatoire");
      return;
    }

    if (!selectedVehicle || selectedVehicle.length === 0) {
      setErrorMessage("Le véhicule est obligatoire");
      return;
    }

    if (!selectedCompanies || selectedCompanies.length === 0) {
      setErrorMessage("La compagnie est obligatoire");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      await updatechauffeur(
        parseInt(id!),
        firstname,
        lastname,
        selectedCompanies[0].id,
      );

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Chauffeur modifié avec succès",
      });
      setTimeout(() => {
        navigate("/chauffeur");
      }, 1000);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h1>Modifier un chauffeur</h1>
        <Toast ref={toast} />
        <div style={inputContainerStyle}>
          <span className="p-float-label">
            <InputText
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              style={inputStyle}
            />
            <label htmlFor="lastname">Nom</label>
          </span>
        </div>

        <div style={inputContainerStyle}>
          <span className="p-float-label">
            <InputText
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              style={inputStyle}
            />
            <label htmlFor="firstname">Prénom</label>
          </span>
        </div>

        <div style={inputContainerStyle}>
          <GetCompanies
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            maxSelection={1}
          />
        </div>

        

        {errorMessage && (
          <div style={messageContainerStyle}>
            <Message severity="error" text={errorMessage} />
          </div>
        )}

        <div style={buttonContainerStyle}>
          <Button
            label="Modifier"
            icon="pi pi-check"
            loading={loading}
            onClick={handleEditChauffeur}
          />
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: "20px",
};

const formStyle = {
  width: "100%",
  maxWidth: "500px",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const inputContainerStyle = {
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
};

const messageContainerStyle = {
  marginBottom: "20px",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};

export default Editchauffeur;
