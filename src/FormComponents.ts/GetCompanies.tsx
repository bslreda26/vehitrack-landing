import { useEffect, useState } from "react"
import Companie from "../models/Companie";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { getCompaniesByCriteria } from "../apicalls/apicallsCompanies";
import { debounce } from "lodash";
import { MultiSelect } from "primereact/multiselect";
import { useDispatch } from "react-redux";
import { setSelectedCompanies as reduxstore } from "../redux/companystore";

function GetCompanies(
    {
        selectedCompanies,
        setSelectedCompanies,
        maxSelection,
        label,
        invalid

    }
        :
        {
            selectedCompanies: Companie[],
            setSelectedCompanies: (comp: Companie[]) => void,
            maxSelection: number,
            label?: string,
            invalid?: boolean
        }
) {

    const [filter, setFilter] = useState<string>('');
    const [options, setOptions] = useState<Companie[]>([])
    const dispatch = useDispatch()



    useEffect(() => {

        debouncedFetchCompanies();

        return (() => {
            debouncedFetchCompanies.cancel();
        })

    }, [filter])


    const fetchCompanies = async () => {
        try {
            const response = await getCompaniesByCriteria(filter)
            setOptions(response.data)
            dispatch(reduxstore(response.data))

        } catch (error) {
            alert("Error fetching companies")
        }
    }

    const debouncedFetchCompanies = debounce(fetchCompanies, 300)


    return (
        <div className="p-float-label"                 style={{ width: "100%" }}
>

            <MultiSelect
                invalid={invalid}
                style={{ width: "100%" }}
                value={selectedCompanies}
                options={options}
                onFilter={(e) => setFilter(e.filter)}
                optionLabel="name"
                filter
                onChange={(e) => setSelectedCompanies(e.value)}
                selectionLimit={maxSelection}
            />

            <label>{label ? label : "Choix de la compagnie"}</label>

        </div>
    )

}

export default GetCompanies