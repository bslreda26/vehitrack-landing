import { useEffect, useState } from "react";
import { Chauffeur } from "../models/Chauffeur";
import { MultiSelect } from "primereact/multiselect";
import { debounce } from "lodash";
import { getChauffeurByCriteria, getChauffeurByCriteriaPaged } from "../apicalls/apiCallsChauffeur";

function GetChauffeur(
    {
        chauffeurs, 
        setChauffeurs,
        maxSelection
    }
    :
    {
        chauffeurs: Chauffeur[],
        setChauffeurs: (chauffeurs: Chauffeur[]) => void,
        maxSelection: number
    }
)
{
    const [options, setOptions] = useState<Chauffeur[]>([]);
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        debouncedFetchChauffeur();

        return (() => {
            debouncedFetchChauffeur.cancel();
        })
    }, [filter])

    const fetchChauffeurs = async () => {
        try {
            const response = await getChauffeurByCriteriaPaged(filter, '', '', 1, 100);
            response.data.data.forEach((item: Chauffeur) => {

                item.label = `${item.first_name} ${item.last_name}`

            })
          
            if (response) setOptions(response.data.data);
        } catch(error) {
            alert('Error fetching chauffeurs');
        }
    }

    const debouncedFetchChauffeur = debounce(fetchChauffeurs, 300);

    return(
        <div className="p-float-label">
            <MultiSelect 
                filter 
                value={chauffeurs}
                options={options}
                style={{width:"100%"}}
                optionLabel='label'
                placeholder="Choix du chauffeur"
                selectionLimit={maxSelection}
                onChange={(e) => setChauffeurs(e.value)}
                onFilter={(e) => setFilter(e.filter)}
            />
            <label>Choix du chauffeur</label>
        </div>
    )
}

export default GetChauffeur;
