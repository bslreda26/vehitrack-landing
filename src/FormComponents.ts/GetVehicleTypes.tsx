import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Vetype } from "../models/Vetype"
import { Dropdown } from "primereact/dropdown"
import { getVetypeByCriteria } from "../apicalls/apicallsVetype"
import { MultiSelect } from "primereact/multiselect"
import { debounce, max } from "lodash"

function GetVehicleTypes(
    {
        selectedTypes,
        setSelectedType,
        maxSelection,
        invalid

    }
        :
        {
            selectedTypes: Vetype[],
            setSelectedType: (types: Vetype[]) => void,
            maxSelection: number,
            invalid?: boolean
        }

) {


    const [filter, setFilter] = useState<string>('')
    const [options, setOptions] = useState<Vetype[]>([])

    useEffect(() => {

        debouncedFetchTypes();

        return (() => {
            debouncedFetchTypes.cancel()
        })

    }, [filter])


    const fetchVetypes = async () => {
        const data = await getVetypeByCriteria(filter)
        if (data) setOptions(data.data);
    }

    const debouncedFetchTypes = debounce(fetchVetypes, 300);


    return (
        <div className="card flex justify-content-center"
            style={{ width: '100%' }}
        >
            <MultiSelect
                style={{ width: '100%' }}
                value={selectedTypes}
                onChange={(e) => setSelectedType(e.value)}
                onFilter={(e) => setFilter(e.filter)}
                options={options} optionLabel="name"
                filter
                placeholder="Choix du type"
                selectionLimit={maxSelection}
                invalid={invalid}
                maxSelectedLabels={3} className="w-full md:w-20rem" />
        </div>
    )


}


export default GetVehicleTypes