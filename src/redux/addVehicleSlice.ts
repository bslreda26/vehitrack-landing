import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vetype } from '../models/Vetype';
import Companie from '../models/Companie';
import { Energy } from '../models/Energy';

interface AddVehicleState {
  // Basic Vehicle Info
  selectedType: Vetype[];
  numeroChassis: string;
  marque: string;
  workingAt: Companie[];
  energy: Energy | null;
  licensePlate: string;

  // Documents Info

  //VISITE TECHNIQUE
  numeroVisite: string;
  dateVisite: Date | null;
  expirationVisite: Date | null;
  scanVisite: File[]

  //CARTE GRISE

  //carte grise
  numeroCarteGrise: string;
  dateCarteGrise: Date | null;
  couleur?: string
  selectedCompanies: Companie[];
  scanCarteGrise: File[]

  //CARTE DE TRANSPORT
  numeroCarteTransport: string;
  expirationCarteTransport: Date | null
  dateCarteTransport: Date | null;
  scanCarteTransport: File[]

  //CARTE DE STATIONNEMENT
  numeroCarteStationnement: string
  scanCarteStationnement: File[]

  //ASSURANCE
  scanAssurance: File[]
  numeroAssurance: string

  //patente
  scanPatente: File[]
  numeroPatente: string



  // Validation States

  //stepOneErrors
  workingAtError: boolean;
  marqueError: boolean;
  selectedTypeError: boolean;
  numeroChassisError: boolean;


  //assurance error
  numeroAssuranceError: boolean



  //carte de visite error
  numeroVisiteError: boolean
  dateVisiteError: boolean
  expirationVisiteError: boolean


  //carte grise
  numeroCarteGriseError: boolean;
  dateCarteGriseError: boolean
  selectedCompaniesError: boolean

  //carte de transport
  expirationCarteTransportError: boolean
  dateCarteTransportError: boolean
  numeroCarteTransportError: boolean

  //stationnement
  numeroCarteStationnementError: boolean,

  //patenteErrors
  numeroPatenteError: boolean


  //scan errors
  scanVisiteError: boolean
  scanCarteGriseError: boolean
  scanCarteTransportError: boolean
  scanCarteStationnementError: boolean
  scanAssuranceError: boolean
  scanPatenteError: boolean


  informationComplete : boolean
}




const initialState: AddVehicleState = {
  // Basic Vehicle Info
  selectedType: [],
  numeroChassis: '',
  marque: '',
  workingAt: [],
  energy: null,
  licensePlate: '',

  //  visite techinque
  numeroVisite: '',
  dateVisite: null,
  expirationVisite: null,
  scanVisite: [],

  //carte grise
  numeroCarteGrise: '',
  dateCarteGrise: null,
  selectedCompanies: [],
  couleur: '',
  scanCarteGrise: [],


  //assurance
  scanAssurance: [],

  //patente
  scanPatente: [],


  //stationnement
  scanCarteStationnement: [],
  numeroCarteStationnement: '',


  //carte de transport
  numeroCarteTransport: '',
  dateCarteTransport: null,
  expirationCarteTransport: null,
  scanCarteTransport: [],


  //patente
  numeroPatente: '',

  // Validation States
  workingAtError: false,
  marqueError: false,
  selectedTypeError: false,
  numeroChassisError: false,

  //step two errors
  numeroVisiteError: false,
  dateVisiteError: false,
  expirationVisiteError: false,


  //step four carte grise
  numeroCarteGriseError: false,
  dateCarteGriseError: false,
  selectedCompaniesError: false,

  //patente error
  numeroPatenteError: false,

  //assurance
  numeroAssurance: '',


  //assurance errors
  numeroAssuranceError: false,

  //stationnement errors
  numeroCarteStationnementError: false,


  //carte de transport errors
  expirationCarteTransportError: false,
  dateCarteTransportError: false,
  numeroCarteTransportError: false,

  scanVisiteError: false,
  scanCarteGriseError: false,
  scanCarteTransportError: false,
  scanCarteStationnementError: false,
  scanAssuranceError: false,
  scanPatenteError: false,

  informationComplete: false


};





const addVehicleSlice = createSlice({
  name: 'addVehicle',
  initialState,
  reducers: {
    setSelectedType: (state: AddVehicleState, action: PayloadAction<Vetype[]>): AddVehicleState => {
      return {
        ...state,
        selectedType: action.payload
      };
    },
    setNumeroChassis: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      
      return {
        ...state,
        numeroChassis: action.payload
      };
    },
    setMarque: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        marque: action.payload
      };
    },
    setWorkingAt: (state: AddVehicleState, action: PayloadAction<Companie[]>): AddVehicleState => {
      return {
        ...state,
        workingAt: action.payload
      };
    },
    setCouleur: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        couleur: action.payload
      };
    },
    setSelectedCompanies: (state: AddVehicleState, action: PayloadAction<Companie[]>): AddVehicleState => {
      return {
        ...state,
        selectedCompanies: action.payload
      };
    },
    setNumeroVisite: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        numeroVisite: action.payload
      };
    },
    setDateVisite: (state: AddVehicleState, action: PayloadAction<Date | null>): AddVehicleState => {
      return {
        ...state,
        dateVisite: action.payload
      };
    },

    setExpirationVisite: (state: AddVehicleState, action: PayloadAction<Date | null>): AddVehicleState => {
      return {
        ...state,
        expirationVisite: action.payload
      };
    },



    setNumeroCarteGrise: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        numeroCarteGrise: action.payload
      };
    },

    setDateCarteGrise: (state: AddVehicleState, action: PayloadAction<Date | null>): AddVehicleState => {
      return {
        ...state,
        dateCarteGrise: action.payload
      };
    },
    setNumeroCarteTransport: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        numeroCarteTransport: action.payload
      };
    },
    setDateCarteTransport: (state: AddVehicleState, action: PayloadAction<Date | null>): AddVehicleState => {
      return {
        ...state,
        dateCarteTransport: action.payload
      };
    },

    setExpirationCarteTransport: (state: AddVehicleState, action: PayloadAction<Date | null>): AddVehicleState => {
      return {
        ...state,
        expirationCarteTransport: action.payload
      };
    },
    setValidationError: (state: AddVehicleState, action: PayloadAction<{ field: keyof AddVehicleState; value: boolean }>): AddVehicleState => {
      if (action.payload.field.endsWith('Error')) {
        return {
          ...state,
          [action.payload.field]: action.payload.value
        };
      }
      return state;
    },
    setWorkingAtError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        workingAtError: action.payload
      };
    },
    setSelectedTypeError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        selectedTypeError: action.payload
      };
    },
    setMarqueError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        marqueError: action.payload
      };
    },

    setNumeroVisiteError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        numeroVisiteError: action.payload
      };
    },

    setDateVisiteError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        dateVisiteError: action.payload
      };
    },

    setExpirationVisiteError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        expirationVisiteError: action.payload
      };
    },


    setDateCarteGriseError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        dateCarteGriseError: action.payload
      };
    },

    setSelectedCOmpaniesError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        selectedCompaniesError: action.payload
      };
    },


    setNumeroCarteGriseError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        numeroCarteGriseError: action.payload
      };
    },


    setNumeroCarteTransportError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        numeroCarteTransportError: action.payload
      };
    },

    setDateCarteTransportError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        dateCarteTransportError: action.payload
      };
    },

    setExpirationCarteTransportError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        expirationCarteTransportError: action.payload
      };
    },

    clearStepOneErrors: (state: AddVehicleState): AddVehicleState => {
      return {
        ...state,
        workingAtError: false,
        selectedTypeError: false,
        marqueError: false,
        numeroChassisError: false,

      };
    },


    setNumeroAssurance: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        numeroAssurance: action.payload
      };
    },

    setNumeroAssuranceError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        numeroAssuranceError: action.payload
      };
    },
    setLicensePlate: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        licensePlate: action.payload
      };
    },

    setEnergy: (state: AddVehicleState, action: PayloadAction<Energy | null>): AddVehicleState => {
      return {
        ...state,
        energy: action.payload
      };
    },

    clearStepTwoErrors: (state: AddVehicleState): AddVehicleState => {
      return {
        ...state,
        numeroVisiteError: false,
        dateVisiteError: false,
        expirationVisiteError: false,
        scanVisiteError: false
      };
    },


    //carte grise errors
    clearStepFourErrors: (state: AddVehicleState): AddVehicleState => {
      return {
        ...state,
        dateCarteGriseError: false,
        numeroCarteGriseError: false,
        selectedCompaniesError: false,
        scanCarteGriseError: false
      };
    },


    clearAssuranceErrors: (state: AddVehicleState): AddVehicleState => {
      return {
        ...state,
        numeroAssuranceError: false,
        scanAssuranceError: false
      };
    },

    clearStepFiveErrors: (state: AddVehicleState): AddVehicleState => {
      return {
        ...state,
        expirationCarteTransportError: false,
        dateCarteTransportError: false,
        numeroCarteTransportError: false,
        scanCarteTransportError: false
      };
    },
    resetForm: (state: AddVehicleState): AddVehicleState => {
      return initialState;
    },

    setScanCarteVisite: (state: AddVehicleState, action: PayloadAction<File[]>) => {
      return {
        ...state,
        scanVisite: action.payload

      }
    },
    setScanCarteGrise: (state: AddVehicleState, action: PayloadAction<File[]>) => {
      return {
        ...state,
        scanCarteGrise: action.payload
      }
    },

    setScanCarteTransport: (state: AddVehicleState, action: PayloadAction<File[]>) => {
      return {
        ...state,
        scanCarteTransport: action.payload
      }
    },

    setScanCarteStationnement: (state: AddVehicleState, action: PayloadAction<File[]>) => {
      return {
        ...state,
        scanCarteStationnement: action.payload
      }
    },


    setScanAssurance: (state: AddVehicleState, action: PayloadAction<File[]>) => {
      return {
        ...state,
        scanAssurance: action.payload
      }
    },


    setScanPatente: (state: AddVehicleState, action: PayloadAction<File[]>) => {
      return {
        ...state,
        scanPatente: action.payload
      }
    },

    setScanCarteGriseError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        scanCarteGriseError: action.payload
      };
    },

    setScanVisiteError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        scanVisiteError: action.payload
      };
    },

    setScanCarteTransportError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        scanCarteTransportError: action.payload
      };
    },

    setScanCarteStationnementError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        scanCarteStationnementError: action.payload
      };
    },

    setScanAssuranceError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        scanAssuranceError: action.payload
      };
    },

    setScanPatenteError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        scanPatenteError: action.payload
      };
    },


    setNumeroCarteDeStaionnement: (state: AddVehicleState, action: PayloadAction<string>): AddVehicleState => {
      return {
        ...state,
        numeroCarteStationnement: action.payload
      }

    },

    setNumeroCarteStationnementError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState => {
      return {
        ...state,
        numeroCarteStationnementError: action.payload
      }
    },

    clearCarteStationnementErrors: (state: AddVehicleState): AddVehicleState => {
      return {
        ...state,
        numeroCarteStationnementError: false,
        scanCarteStationnementError: false
      }
    },

    setNumeroPatente: (state: AddVehicleState, action: PayloadAction<string>) : AddVehicleState =>{
      return {
        ...state, 
        numeroPatente: action.payload
      }
    },

    setNumeroPatenteError: (state: AddVehicleState, action: PayloadAction<boolean>): AddVehicleState =>{
      return {
        ...state,
        numeroPatenteError: action.payload
      }
    },

    clearPatenteErrors: (state: AddVehicleState): AddVehicleState =>{
      return {
        ...state,
        numeroPatenteError: false,
        scanPatenteError: false
        
      }
    },

    checkInformationComplete: (state: AddVehicleState): AddVehicleState => {
      const isComplete = 
        // Vehicle Info
        state.selectedType !== null &&
        state.marque.length > 0 &&
        state.numeroChassis.length > 0 &&
        state.workingAt.length > 0 &&
        state.energy !== null &&
        state.licensePlate.length > 0 &&

        // Visite Technique
        state.numeroVisite.length > 0 &&
        state.dateVisite !== null &&
        state.expirationVisite !== null &&
        state.scanVisite.length > 0 &&

        // Carte Grise
        state.numeroCarteGrise.length > 0 &&
        state.dateCarteGrise !== null &&
        state.selectedCompanies.length > 0 &&
        state.scanCarteGrise.length > 0 &&

        // Carte Transport
        state.numeroCarteTransport.length > 0 &&
        state.dateCarteTransport !== null &&
        state.expirationCarteTransport !== null &&
        state.scanCarteTransport.length > 0 &&

        // Carte Stationnement
        state.numeroCarteStationnement.length > 0 &&
        state.scanCarteStationnement.length > 0 &&

        // Assurance
        state.numeroAssurance.length > 0 &&
        state.scanAssurance.length > 0 &&

        // Patente
        state.numeroPatente.length > 0 &&
        state.scanPatente.length > 0;

      return {
        ...state,
        informationComplete: isComplete
      };
    }
  },
});

export const {
  setSelectedType,
  setNumeroChassis,
  setMarque,
  setWorkingAt,
  setCouleur,
  setDateCarteGrise,
  setSelectedCompanies,
  setNumeroVisite,
  setDateVisite,
  setExpirationVisite,
  setNumeroCarteGrise,
  setNumeroCarteTransport,
  setExpirationCarteTransport,
  setDateCarteTransport,
  setValidationError,
  resetForm,
  setWorkingAtError,
  setSelectedTypeError,
  setMarqueError,
  setNumeroVisiteError,
  setDateVisiteError,
  setExpirationVisiteError,

  setDateCarteGriseError,
  setNumeroCarteGriseError,
  setEnergy,
  setDateCarteTransportError,
  setNumeroCarteTransportError,
  setExpirationCarteTransportError,
  setSelectedCOmpaniesError,
  setLicensePlate,
  clearStepOneErrors,
  clearStepTwoErrors,
  clearStepFourErrors,
  clearStepFiveErrors,

  setScanCarteGrise,
  setScanCarteStationnement,
  setScanCarteTransport,
  setScanCarteVisite,
  setScanAssurance,
  setScanPatente,

  setScanCarteGriseError,
  setScanCarteStationnementError,
  setScanCarteTransportError,
  setScanAssuranceError,
  setScanPatenteError,
  setScanVisiteError,

  setNumeroAssurance,
  setNumeroAssuranceError,
  clearAssuranceErrors,

  setNumeroCarteDeStaionnement,
  setNumeroCarteStationnementError,
  clearCarteStationnementErrors,

  setNumeroPatente,
  setNumeroPatenteError,
  clearPatenteErrors,
  checkInformationComplete

} = addVehicleSlice.actions;

export default addVehicleSlice.reducer;