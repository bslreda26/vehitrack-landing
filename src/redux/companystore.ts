import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Companie from "../models/Companie";

export interface CompanyState {
  selectedCompanies: Companie[];
}

const initialState: CompanyState = {
  selectedCompanies: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedCompanies: (
      state,
      action: PayloadAction<{
        selectedCompanies: Companie[];
      }>
    ): CompanyState => {
      return {
        ...state,
        selectedCompanies: action.payload.selectedCompanies,
      };
    },
  },
});

export const { setSelectedCompanies } = companySlice.actions;

export default companySlice.reducer;
