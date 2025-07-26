import { useEffect, useState } from "react";
import { Energy } from "../models/Energy";
import { getAllEnergies } from "../apicalls/apiCallsEnergy";
import { Dropdown } from "primereact/dropdown";

function GetEnergies(
    {
        selectedEnergies,
        setSelectedEnergy,
        invalid
    }
        :
        {

            selectedEnergies: Energy |null,
            setSelectedEnergy: (energies: Energy | null) => void,
            invalid?: boolean

        }
) {

    const [energies, setEnergies] = useState<Energy[]>([]);


    useEffect(() => {
        async function getEnergies() {
            const response = await getAllEnergies();
            setEnergies(response.data);
        }
        getEnergies();
    }, []);




    return (<div className="p-float-label">

        <Dropdown
            style={{ width: "100%" }}
            showClear
            value={selectedEnergies}
            options={energies}
            onChange={(e) => {
                setSelectedEnergy(e.value as Energy);
            }}
            optionLabel="name"
            placeholder="Energie"
            invalid={invalid}
        />
        <label htmlFor="energy">Energies</label>

    </div>)


}

export default GetEnergies