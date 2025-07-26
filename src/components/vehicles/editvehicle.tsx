import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import GetVehicleTypes from "../../FormComponents.ts/GetVehicleTypes";
import { Vetype } from "../../models/Vetype";
import GetCompanies from "../../FormComponents.ts/GetCompanies";
import Companie from "../../models/Companie";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { editVehicle, getVehicleById, UpdateVehicleData } from "../../apicalls/apicallsVehicle";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";
import { Etatvehicle } from "../../models/etatvehicle";
import GetEtat from "../../FormComponents.ts/Getetat";

function EditVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useRef<Toast>(null);

  const [model, setModel] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [couleur, setCouleur] = useState<string>("");
  const [numeroChassis, setNumeroChassis] = useState<string>("");
  const [selectedVeType, setSelectedVeType] = useState<Vetype[]>([]);
  const [selectedetat, setSelectedetat] = useState<Etatvehicle[]>([]);
  const [owningCompanies, setOwningCompanies] = useState<Companie[]>([]);
  const [workSites, setWorkSites] = useState<Companie[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchVehicle(parseInt(id));
    }
  }, [id]);

  const fetchVehicle = async (vehicleId: number) => {
    try {
      setLoading(true);
      const response = await getVehicleById(vehicleId);
      const vehicleData = response.data;

      setModel(vehicleData.marque || "");
      setOwner(vehicleData.owner || "");
      setLicensePlate(vehicleData.licenseplate || "");
      setCouleur(vehicleData.couleur || "");
      setNumeroChassis(vehicleData.numero_chassis || "");
      setSelectedVeType(vehicleData.vetypes ? [vehicleData.vetypes] : []);
      // setSelectedetat(vehicleData.etatvehicle ? [vehicleData.etatvehicle] : []);
      setOwningCompanies(vehicleData.companie ? [vehicleData.companie] : []);
      setWorkSites(vehicleData.working_company ? [vehicleData.working_company] : [])
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Erreur lors du chargement du véhicule",
      });
      navigate("/vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = async () => {
    if (!licensePlate || !selectedVeType.length || !owningCompanies.length || !workSites.length) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const vehicleData: UpdateVehicleData = {
        marque: model || undefined,
        licenseplate: licensePlate,
        vetype_id: selectedVeType[0].id,
        companie_id: owningCompanies[0].id,
        couleur: couleur || undefined,
        numero_chassis: numeroChassis || undefined
      };

      // await editVehicle(parseInt(id!), vehicleData);

      await editVehicle(parseInt(id!), couleur, numeroChassis,
        licensePlate, selectedVeType[0].id, owningCompanies[0].id,
        workSites[0].id

      )

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Véhicule modifié avec succès",
      });

      // setTimeout(() => {
      //   navigate("/vehicle");
      // }, 1000);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Erreur lors de la modification du véhicule",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h1>Modifier un véhicule</h1>

        {/* <div className="p-field">
            <label htmlFor="owner">Propriétaire</label>
            <InputText
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full mb-3"
              placeholder="Entrer le propriétaire"
            />
          </div> */}

        <div className="p-float-label" style={{ width: "100%" }}
        >
          <InputText
            style={{ width: "100%" }}
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full mb-3"
            placeholder="Entrer le modèle"
          />
          <label htmlFor="model">Modèle</label>
        </div>

        <div className="p-float-label" style={{ width: "100%" }}>
          <InputText
            style={{ width: "100%" }}
            id="couleur"
            value={couleur}
            onChange={(e) => setCouleur(e.target.value)}
            className="w-full mb-3"
            placeholder="Entrer la couleur"
          />
          <label htmlFor="couleur">Couleur</label>
        </div>

        <div className="p-float-label" style={{ width: "100%" }}>
          <InputText
            style={{ width: "100%" }}
            id="numeroChassis"
            value={numeroChassis}
            onChange={(e) => setNumeroChassis(e.target.value)}
            className="w-full mb-3"
            placeholder="Entrer le numéro de chassis"
          />
          <label htmlFor="numeroChassis">Numéro de chassis</label>
        </div>

        <div className="p-float-label" style={{ width: "100%" }}>
          <InputText
            style={{ width: "100%" }}
            id="licensePlate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className="w-full mb-3"
            placeholder="Entrer la plaque d'immatriculation"
          />
          <label htmlFor="licensePlate">Plaque d'immatriculation</label>
        </div>


        <GetVehicleTypes
          selectedTypes={selectedVeType}
          setSelectedType={setSelectedVeType}
          maxSelection={1}
        />


        <GetCompanies
          label="Compangie propriétaire"
          selectedCompanies={owningCompanies}
          setSelectedCompanies={setOwningCompanies}
          maxSelection={1}
        />
        <GetCompanies
          label="Site d'activité"
          selectedCompanies={workSites}
          setSelectedCompanies={setWorkSites}
          maxSelection={1}
        />

        {/* <GetEtat
          selectedetat={selectedetat}
          setSelectedetat={setSelectedetat}
          maxSelection={1}
        /> */}

        {errorMessage && (
          <div style={messageContainerStyle}>
            <Message severity="error" text={errorMessage} />
          </div>
        )}

        <Button
          label="Modifier"
          icon="pi pi-check"
          loading={loading}
          onClick={handleEditVehicle}
        />
        <Toast ref={toast} />
      </div>
    </div>


  );
}


const containerStyle = {
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"

}

const formStyle = {
  backgroundColor: "white",
  width: "40% ",
  display: "flex",
  flexDirection: "column" as const,
  gap: '2em',
  justifyContent: "center",
  alignItems: "center"
};



const messageContainerStyle = {
  marginBottom: "20px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

export default EditVehicle;
