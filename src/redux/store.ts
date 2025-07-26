import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./login_reducer";
import addVehicleReducer from "./addVehicleSlice";
import companiereducer from "./companystore"
const store = configureStore({
  reducer: {
    loginReducer: loginReducer,
    addVehicleReducer: addVehicleReducer,
    companiereducer: companiereducer,
    // add the reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
