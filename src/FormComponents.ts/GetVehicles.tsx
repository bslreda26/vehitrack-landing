import { useEffect, useState } from "react";
import Vehicles from "../components/vehicles/vehicle"
import { Vehicle } from "../models/Vehicle"
import { MultiSelect } from "primereact/multiselect";
import { getValue } from "@testing-library/user-event/dist/utils";
import { getVehicleByCriteria, getVehicleByCriteriaPaged } from "../apicalls/apicallsVehicle";
import { debounce } from "lodash";
import { getVetypeByCriteria } from "../apicalls/apicallsVetype";

function GetVehicles(
    {
        vehicles, 
        setVehicles,
        maxSelection
    }
    :
    {
        vehicles: Vehicle[],
        setVehicles:(vehicles: Vehicle[]) => void,
        maxSelection: number
    }
)
{


    const [options, setOptions]=useState<Vehicle[]>([]);
    const [filter, setFilter]=useState<string>('')

    useEffect(() =>{
        debouncedFetchVehicle();

        return (() =>{
            debouncedFetchVehicle.cancel();
        })
    }, [filter])

    useEffect(() =>{
        vehicles.forEach(item =>{
            item.label = `${item.licenseplate} - ${item.marque}`
        })
    }, [vehicles])

    const fetchVehicles =async  () =>{

        
      try
      {
        const response = await getVehicleByCriteriaPaged( 1, 100, filter);
        const vehicles = response.data.data;
        vehicles.forEach((item: Vehicle) => {

            item.label = `${item.licenseplate} - ${item.marque}` 
            
        });
        if (response) setOptions(response.data.data);
      }catch(error)
      {
        alert('Error fetching vehicles')
      }

    }

    const debouncedFetchVehicle = debounce(fetchVehicles, 300)


    return(
        <div className="p-float-label" style={{width:"100%"}}>
            <MultiSelect filter 
            value={vehicles}
            options={options}
            style={{width:"100%"}}
            optionLabel='label'
            placeholder="Choix du vehicule"
            selectionLimit={maxSelection}
            onChange={(e) => setVehicles(e.value)}
            onFilter={(e) => setFilter(e.filter)}/>

            <label>Choix du vehicule</label>
            
        </div>
    )



}

export default GetVehicles