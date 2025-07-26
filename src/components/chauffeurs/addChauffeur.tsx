import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";

import driver from "./../../assets/driver.png";
import { Button } from "primereact/button";
import GetCompanies from "../../FormComponents.ts/GetCompanies";
import Companie from "../../models/Companie";

import { addChauffeur } from "../../apicalls/apiCallsChauffeur";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";

function AddChauffeur() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [companies, setCompanies] = useState<Companie[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useRef(null);


  const handleAddChauffeur = async () => {
    if (lastName === '' || lastName.length === 0) {
      setErrorMessage("Le nom est obligatoire")
      return
    }

    if (firstName === '' || firstName.length === 0) {
      setErrorMessage("Le prénom est obligatoire")
      return;
    }

    if (companies.length === 0) {
      setErrorMessage("La compagnie est obligatoire")
      return;
    }

   

    setErrorMessage('')

    if (companies[0].id)
      try {


        addChauffeur(firstName,
          lastName,
          companies[0].id ? companies[0].id : 0,
          );
        handleResetForm();
        (toast.current as any).show({ severity: 'success', summary: 'ok', detail: 'Chaffeur ajouté' });

      }
      catch (error: any) {
        (toast.current as any).show({ severity: 'error', summary: 'x', detail: error.message });

      }




  }

  const handleResetForm = () => {
    setFirstName('')
    setLastName('')
    setCompanies([])
    setErrorMessage('')
  }



  return (
    <div style={containerStyle}>
      <div style={imageStyle}>
        <img src={driver} style={{ height: "40vh" }} alt="Car" />
      </div>

      <div style={formStyle}>
        <div style={innerForm}>
          <div className="p-float-label">
            <InputText
              style={{ width: "100%" }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)} />
            <label>Nom</label>
          </div>


          <div className="p-float-label">
            <InputText
              style={{ width: "100%" }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)} />
            <label>Prénom</label>
          </div>

          <div>

            <GetCompanies maxSelection={1} selectedCompanies={companies}
              setSelectedCompanies={setCompanies} />
          </div>

         

          <div style={controlsStyle}>

            {errorMessage.length > 0 && < Message severity="error" text={errorMessage} />}
            <Button icon='pi pi-sync'
              onClick={handleResetForm}
              severity="secondary"
            />

            <Button label="Ajouter"
              onClick={handleAddChauffeur}
              disabled={errorMessage.length > 0}
              icon='pi pi-user-plus' />
          </div>




        </div>
      </div>
      <Toast ref={toast} position="bottom-center" />

    </div>

  );
}


const containerStyle = {
  display: "flex",
  flexDirection: "row" as const,
  height: "90vh",
  justifyContent: "center",
  alignItems: "center"
}

const formStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "1.5em",
  alignItems: "center",
  justifyContent: "center",
  flex: 3,


}

const innerForm = {
  width: "60%",
  display: "flex",
  flexDirection: "column" as const,
  gap: '1.5em'
}

const controlsStyle = {
  display: "flex",
  flexDirection: "row" as const,
  gap: "1em",
  width: "100%",
  justifyContent: "flex-end"

}

const imageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1
}

export default AddChauffeur;
