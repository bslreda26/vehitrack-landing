import { useEffect, useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import GetCompanies from "../../FormComponents.ts/GetCompanies";
import Companie from "../../models/Companie";
import { InputText } from "primereact/inputtext";
import GetVehicleTypes from "../../FormComponents.ts/GetVehicleTypes";
import { Vetype } from "../../models/Vetype";
import { Calendar } from "primereact/calendar";

import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { clearStepOneErrors, clearStepTwoErrors, setDateVisite, setDateVisiteError, setMarque, setMarqueError, setNumeroChassis, setNumeroVisite, setNumeroVisiteError, setSelectedType, setSelectedTypeError, setWorkingAt, setWorkingAtError, setNumeroCarteGrise, setCouleur, setExpirationVisite, setExpirationVisiteError, setDateCarteGrise, setNumeroCarteGriseError, setDateCarteGriseError, setSelectedCompanies, setSelectedCOmpaniesError, clearStepFourErrors, setEnergy, setNumeroCarteTransport, setDateCarteTransport, setExpirationCarteTransport, setDateCarteTransportError, setNumeroCarteTransportError, setExpirationCarteTransportError, clearStepFiveErrors, setLicensePlate, setScanCarteGrise, setScanCarteTransport, setScanAssurance, setScanCarteStationnement, setScanPatente, setScanCarteVisite, setScanVisiteError, setScanCarteGriseError, setScanCarteTransportError, setNumeroAssurance, setNumeroAssuranceError, setScanAssuranceError, clearAssuranceErrors, setNumeroCarteDeStaionnement, setNumeroCarteStationnementError, setScanCarteStationnementError, clearCarteStationnementErrors, setNumeroPatente, setNumeroPatenteError, setScanPatenteError, checkInformationComplete, clearPatenteErrors } from "../../redux/addVehicleSlice";
import GetEnergies from "../../FormComponents.ts/GetEnergies";
import { Energy } from "../../models/Energy";
import { DocumentDto, VehicleDto } from "../../apicalls/dtos/AddVehicleDtos";
import { Doctype } from "../../models/Doctype";
import { getalldoctypes } from "../../apicalls/apicalldoctype";
import { doctypeSeederValues } from "../../models/DoctypeSeeders";
import { addVehicle } from "../../apicalls/apicallsVehicle";
import FileUpload from "../FileUploader/FileUpload";
import StepProgress from "../StepProgress/StepProgress";
import { useNavigate } from "react-router-dom";

function AddVehicle() {

  const stepperRef = useRef(null);

  const state = useSelector((state: RootState) => state.addVehicleReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [documentTypes, setDocumentTypes] = useState<Doctype[]>([]);

  useEffect(() => {
    getalldoctypes()
      .then(response => {
        setDocumentTypes(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  const toast = useRef(null);



  const validateVehicule = () => {
    dispatch(clearStepOneErrors());
    (stepperRef.current as unknown as any).nextCallback()
    setCurrentStep(currentStep + 1);
  }

  const validateVisite = () => {
    dispatch(clearStepTwoErrors());
    dispatch(checkInformationComplete());
    (stepperRef.current as unknown as any).nextCallback();
    setCurrentStep(currentStep + 1);
  }

  const validateCarteGrise = () => {
    dispatch(clearStepFourErrors());
    dispatch(checkInformationComplete());
    (stepperRef.current as unknown as any).nextCallback();
    setCurrentStep(currentStep + 1);
  }

  const validateCarteTransport = () => {
    dispatch(clearStepFiveErrors());
    (stepperRef.current as unknown as any).nextCallback();
    setCurrentStep(currentStep + 1);
  }

  const validateAssurance = () => {
    dispatch(clearAssuranceErrors());
    dispatch(checkInformationComplete());
    (stepperRef.current as unknown as any).nextCallback();
    setCurrentStep(currentStep + 1);
  }

  const validateCarteDeStationnement = () => {
    dispatch(clearCarteStationnementErrors());
    dispatch(checkInformationComplete());
    (stepperRef.current as unknown as any).nextCallback();
    setCurrentStep(currentStep + 1);
  }

  const validatePatente = () => {
    dispatch(clearPatenteErrors());
    dispatch(checkInformationComplete());
    (stepperRef.current as unknown as any).nextCallback();
    setCurrentStep(currentStep + 1);
  }

  const handleAddVehicle = () => {

    const vehicleDto: VehicleDto = {
      couleur: state.couleur,
      working_at: state.workingAt[0] ? state.workingAt[0].id : null,
      marque: state.marque,
      energy_id: state.energy ? state.energy.id : null,
      type_id: state.selectedType[0].id,
      numero_chassis: state.numeroChassis,
      licenseplate: state.licensePlate,
      companie_id: state.selectedCompanies[0] ? state.selectedCompanies[0].id : null

    }

    const visiteId = documentTypes.find(item => item.name === doctypeSeederValues.VISITE_TECHNIQUE)?.id;
    const visiteDto: DocumentDto = {
      doc_number: state.numeroVisite,
      doc_type_id: visiteId ? visiteId : 0,
      established_at: state.dateVisite,
      expiry_date: state.expirationVisite,
      file: state.scanVisite[0]
    }

    const carteGriseId = documentTypes.find(item => item.name === doctypeSeederValues.CARTE_GRISE)?.id;
    const carteGriseDto: DocumentDto = {
      doc_number: state.numeroCarteGrise,
      doc_type_id: carteGriseId ? carteGriseId : 0,
      established_at: state.dateCarteGrise,
      expiry_date: null,
      file: state.scanCarteGrise[0]
    }

    const carteTransportId = documentTypes.find(item => item.name === doctypeSeederValues.CARTE_TRANSPORT)?.id;
    const carteTransportDto: DocumentDto = {
      file: state.scanCarteTransport[0],
      doc_number: state.numeroCarteTransport,
      doc_type_id: carteTransportId ? carteTransportId : 0,
      established_at: state.dateCarteTransport,
      expiry_date: state.expirationCarteTransport
    }

    const assuranceId = documentTypes.find(item => item.name === doctypeSeederValues.ASSURANCE)?.id;
    const assuranceDto: DocumentDto = {
      file: state.scanAssurance[0],
      doc_number: state.numeroAssurance,
      doc_type_id: assuranceId ? assuranceId : 0,
      established_at: null,
      expiry_date: null
    }


    const patenteId = documentTypes.find(item => item.name === doctypeSeederValues.PATENTE)?.id;
    const patenteDto: DocumentDto = {
      file: state.scanPatente[0],
      doc_number: state.numeroPatente,
      doc_type_id: patenteId ? patenteId : 0,
    }
    const carteStationnementId = documentTypes.find(item => item.name === doctypeSeederValues.CARTE_STATIONNEMENT)?.id;
    const stationnementDto: DocumentDto = {
      file: state.scanCarteStationnement[0],
      doc_number: state.numeroCarteStationnement,
      doc_type_id: carteStationnementId ? carteStationnementId : 0,
    }




    addVehicle(vehicleDto, visiteDto, carteGriseDto, carteTransportDto, assuranceDto, patenteDto, stationnementDto)
      .then(response => {
        (toast.current as any).show({ severity: 'success', summary: 'ok', detail: 'Véhicule ajouté' });

        const id = response.data.id

        navigate(`/vehicles/${id}/documents`)

      })
      .catch(error => {
        (toast.current as any).show({ severity: 'error', summary: 'ok', detail: 'Echec de l\'ajout' });

      })

  }


  const handleWorkingAt = (companies: Companie[]) => {
    dispatch(setWorkingAt(companies))
  }
  const handleSelectedType = (types: Vetype[]) => {
    dispatch(setSelectedType(types))
  }

  const handleSelectCompanies = (companies: Companie[]) => {
    dispatch(setSelectedCompanies(companies))
  }

  const handleEnergy = (energy: Energy | null) => {
    dispatch(setEnergy(energy))
  }

  const steps = [
    {
      label: 'Véhicule',
      subSteps: [
        {
          label: 'Informations de base',
          completed: true,
          error: false
        },],
    },
    {
      label: 'Visite',
      subSteps: [
        { label: 'Numero', completed: true, error: false },
        { label: 'Date', completed: true, error: false },
        { label: 'Expiration', completed: true, error: false },
        { label: 'Scan', completed: true, error: false }
      ]
    },
    {
      label: 'Carte grise',
      subSteps: [
        { label: 'Numero', completed: true, error: false },
        { label: "Entreprise", completed: true, error: false },
        { label: 'Date', completed: true, error: false },
        { label: 'Document', completed: true, error: false }
      ]
    },
    {
      label: 'Carte de transport',
      subSteps: [
        { label: 'Numero', completed: true, error: false },
        { label: 'Date', completed: true, error: false },
        { label: 'Expiration', completed: true, error: false },
        { label: 'Document', completed: true, error: false }
      ]
    },
    {
      label: "Assurance",
      subSteps: [
        {
          label: "Numéro", completed: true, error: false
        },
        {
          label: "Document", completed: true, error: false
        }
      ]
    },
    {
      label: "Carte de stationnement",
      subSteps: [
        { label: "Document", completed: true, error: false }
      ]
    },
    {
      label: "Patente",
      subSteps: [
        { label: "Document", completed: true, error: false }
      ]
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div style={containerStyle}>
      <div style={stepperStyle}>
        <Stepper
          linear
          ref={stepperRef} orientation="vertical">
          <StepperPanel header="Nouveau véhicule">
            <div style={stepStyle}>
              <div style={formStyle}>
                <div className="p-float-label">
                  <InputText style={{ width: "100%" }}
                    value={state.licensePlate} onChange={(e) => dispatch(setLicensePlate(e.target.value))} />
                  <label>Immatriculation</label>

                </div>

                <GetCompanies
                  label="Lieu d'activité"
                  maxSelection={1} selectedCompanies={state.workingAt} setSelectedCompanies={handleWorkingAt} />


                <div className="p-float-label">
                  <InputText

                    style={{ width: "100%" }}
                    id="marque"
                    value={state.marque}
                    onChange={(e) => dispatch(setMarque(e.target.value))} />
                  <label>Marque</label>
                </div>

                <GetEnergies selectedEnergies={state.energy} setSelectedEnergy={handleEnergy} />
                <GetVehicleTypes

                  maxSelection={1} selectedTypes={state.selectedType} setSelectedType={handleSelectedType} />


                <div className="p-float-label">
                  <InputText style={{ width: "100%" }} id="chassis" value={state.numeroChassis} onChange={(e) => dispatch(setNumeroChassis(e.target.value))} />
                  <label>Numero de chassis</label>
                </div>
                <div className="flex py-4">
                  <Button label="Visite technique" icon="pi pi-arrow-right" iconPos="right" onClick={() => validateVehicule()} />
                </div>
              </div>
            </div>
          </StepperPanel>
          <StepperPanel

            header="Visite technique">
            <div style={stepStyle}>

              <div className="p-float-label">
                <InputText

                  style={{ width: "100%" }} id="visite" value={state.numeroVisite} onChange={(e) => dispatch(setNumeroVisite(e.target.value))} />
                <label>Numero de visite</label>
              </div>

              <div className="p-float-label">
                <Calendar showIcon
                  showOnFocus={false}
                  locale="fr"

                  value={state.dateVisite}
                  style={{ width: "80%" }}
                  onChange={(e) => dispatch(setDateVisite(e.value as Date))} />
                <label>Etablie le</label>
              </div>

              <div className="p-float-label">
                <Calendar showIcon
                  showOnFocus={false}
                  locale="fr"

                  value={state.expirationVisite}
                  style={{ width: "80%" }}
                  onChange={(e) => dispatch(setExpirationVisite(e.value as Date))} />
                <label>Expiration</label>
              </div>


              <FileUpload
                accept=".jpg, .jpeg, .png, "

                onRemoveFile={() => dispatch(setScanCarteVisite([]))}
                maxSelection={1}

                onFilesChange={(files: File[]) => dispatch(setScanCarteVisite(files))}
                selectedFiles={state.scanVisite}
              />


            </div>

            <div style={{ gap: "1em", display: "flex", flexDirection: "row" }}>
              <Button label="Vehicule" severity="secondary" icon="pi pi-arrow-left" onClick={() => (stepperRef.current as unknown as any).prevCallback()} />
              <Button label="Carte grise" icon="pi pi-arrow-right" iconPos="right" onClick={() => validateVisite()} />
            </div>

          </StepperPanel>




          <StepperPanel header="Carte grise">
            <div style={stepStyle}>

              <div className="p-float-label">
                <InputText

                  style={{ width: "100%" }} value={state.numeroCarteGrise} onChange={(e) => dispatch(setNumeroCarteGrise(e.target.value))} />
                <label>Numero de carte</label>
              </div>

              <div className="p-float-label">
                <InputText
                  style={{ width: "100%" }} value={state.couleur} onChange={(e) => dispatch(setCouleur(e.target.value))} />
                <label>Couleur</label>
              </div>

              <GetCompanies
                label="Propriétaire"
                invalid={state.selectedCompaniesError}
                maxSelection={1} selectedCompanies={state.selectedCompanies} setSelectedCompanies={handleSelectCompanies} />


              <div className="p-float-label">
                <Calendar showIcon
                  showOnFocus={false}
                  locale="fr"

                  value={state.dateCarteGrise}
                  style={{ width: "100%" }}
                  onChange={(e) => dispatch(setDateCarteGrise(e.value as Date))} />
                <label>Etablie le</label>
              </div>


              <FileUpload
                accept=".jpg, .jpeg, .png, "

                maxSelection={1}

                onFilesChange={(files: File[]) => dispatch(setScanCarteGrise(files))}
                onRemoveFile={() => dispatch(setScanCarteGrise([]))}
                selectedFiles={state.scanCarteGrise}
              />


              {/* <FileUpload chooseLabel="Carte grise" mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
            </div>

            <div style={{ gap: "1em", display: "flex", flexDirection: "row" }}>
              <Button label="Carte de stationnement" severity="secondary" icon="pi pi-arrow-left" onClick={() => (stepperRef.current as unknown as any).prevCallback()} />
              <Button label="Carte de transport" icon="pi pi-arrow-right" iconPos="right" onClick={() => validateCarteGrise()} />
            </div>
          </StepperPanel>



          <StepperPanel header="Carte de transport">
            <div style={stepStyle}>

              <div className="p-float-label">
                <InputText

                  style={{ width: "100%" }} id="visite" value={state.numeroCarteTransport}
                  onChange={(e) => dispatch(setNumeroCarteTransport(e.target.value))} />
                <label>Numero de carte</label>
              </div>

              <div className="p-float-label">
                <Calendar showIcon
                  showOnFocus={false}
                  locale="fr"

                  value={state.dateCarteTransport}
                  style={{ width: "100%" }}
                  onChange={(e) => dispatch(setDateCarteTransport(e.value as Date))} />
                <label>Etablie le</label>
              </div>

              <div className="p-float-label">
                <Calendar showIcon
                  showOnFocus={false}
                  locale="fr"

                  value={state.expirationCarteTransport}
                  style={{ width: "100%" }}
                  onChange={(e) => dispatch(setExpirationCarteTransport(e.value as Date))} />
                <label>Expiration</label>
              </div>

              {/* <FileUpload chooseLabel="Carte de transport" mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
              <FileUpload
                accept=".jpg, .jpeg, .png, "

                maxSelection={1}
                onFilesChange={(files: File[]) => dispatch(setScanCarteTransport(files))}
                onRemoveFile={() => dispatch(setScanCarteTransport([]))}
                selectedFiles={state.scanCarteTransport}

              />


            </div>
            <div style={{ gap: "1em", display: "flex", flexDirection: "row" }}>
              <Button label="Carte grise" severity="secondary" icon="pi pi-arrow-left" onClick={() => (stepperRef.current as unknown as any).prevCallback()} />
              <Button label="Assurance" icon="pi pi-arrow-right" iconPos="right" onClick={() => validateCarteTransport()} />
            </div>
          </StepperPanel>

          <StepperPanel header="Assurance">
            <div style={stepStyle}>

              <div className="p-float-label" style={{ width: "100%" }}>
                <InputText value={state.numeroAssurance}
                  style={{ width: "100%" }}

                  onChange={(e) => dispatch(setNumeroAssurance(e.target.value))} />

                <label>Numéro d'assurance</label>
              </div>

              <FileUpload
                accept=".jpg, .jpeg, .png, "

                maxSelection={1}
                onFilesChange={(files: File[]) => dispatch(setScanAssurance(files))}
                onRemoveFile={() => dispatch(setScanAssurance([]))}
                selectedFiles={state.scanAssurance}

              />


            </div>
            <div style={{ gap: "1em", display: "flex", flexDirection: "row" }}>
              <Button label="Carte de transport" severity="secondary" icon="pi pi-arrow-left" onClick={() => (stepperRef.current as unknown as any).prevCallback()} />
              <Button label="Carte de stationnement" icon="pi pi-arrow-right" iconPos="right" onClick={() => validateAssurance()} />
            </div>
          </StepperPanel>

          <StepperPanel header="Carte de stationnement">
            <div style={stepStyle}>

              <div className="p-float-label" style={{ width: "100%" }}>
                <InputText
                  style={{ width: "100%" }}
                  value={state.numeroCarteStationnement}
                  onChange={(e) => { dispatch(setNumeroCarteDeStaionnement(e.target.value)) }}

                />

                <label>Numero </label>

              </div>

              <FileUpload
                accept=".jpg, .jpeg, .png, "

                maxSelection={1}
                onFilesChange={(files: File[]) => dispatch(setScanCarteStationnement(files))}
                onRemoveFile={() => dispatch(setScanCarteStationnement([]))}
                selectedFiles={state.scanCarteStationnement}

              />


            </div>
            <div style={{ gap: "1em", display: "flex", flexDirection: "row" }}>
              <Button label="Assurance" severity="secondary" icon="pi pi-arrow-left" onClick={() => (stepperRef.current as unknown as any).prevCallback()} />
              <Button label="Patente" icon="pi pi-arrow-right" iconPos="right" onClick={() => validateCarteDeStationnement()} />
            </div>
          </StepperPanel>

          <StepperPanel header="Patente">
            <div style={stepStyle}>

              <div className="p-float-label" style={{ width: "100%" }}>
                <InputText
                  style={{ width: "100%" }}
                  value={state.numeroPatente}

                  onChange={e => dispatch(setNumeroPatente(e.target.value))} />
                <label>Numero</label>
              </div>

              <FileUpload
                accept=".jpg, .jpeg, .png "

                onFilesChange={(files: File[]) => dispatch(setScanPatente(files))}
                onRemoveFile={() => dispatch(setScanPatente([]))}
                selectedFiles={state.scanPatente}
              />


            </div>
            <div style={{ gap: "1em", display: "flex", flexDirection: "row" }}>
              <Button label="Carte de stationnement" severity="secondary" icon="pi pi-arrow-left" onClick={() => (stepperRef.current as unknown as any).prevCallback()} />
              {/* <Button label="Terminer" icon="pi pi-check" iconPos="right" onClick={() => validatePatente()} /> */}
            </div>
          </StepperPanel>

        </Stepper>

        <div style={finalBtnStyle}>
          <Button
            onClick={() => handleAddVehicle()}
            severity="success"
            label="Ajouter le vehicule"
            icon='pi pi-car' />
        </div>


      </div>


      <div>
        {/* <Button label="Ajouter" icon="pi pi-plus"
          iconPos="right" onClick={() => handleAddVehicle()} /> */}
      </div>

      <div style={progressStyle}>
        <StepProgress
          steps={steps}
          currentStep={currentStep}
          orientation="vertical"
        />
      </div>

      <Toast position="bottom-center" ref={toast}></Toast>

    </div>
  )

}

const containerStyle = {

  display: "flex",
  flexDirection: "row" as const

}

const stepperStyle = {
  flex: 0.5

}

const stepStyle = {

  margin: "1em",
  display: "flex",
  flexDirection: "column" as const,
  gap: "1.5em"


}

const formStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "1.5em"
}

const progressStyle = {
  maxHeight: "90vh",
  overflow: "scroll",
  display: "flex",
  flex: 0.5,
  justifyContent: "center",
  alignItems: "center"
}


const finalBtnStyle = {
  display: "flex",
  justifyContent: "center",


}

export default AddVehicle