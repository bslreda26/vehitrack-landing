import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { getEtatByCriteria } from "../apicalls/apicallsetatvehicle";
import { debounce } from "lodash";
import { Etatvehicle } from "../models/etatvehicle";

function GetEtat(
  {
    selectedetat,
    setSelectedetat,
    maxSelection,
    label,
    invalid
  }:
  {
    selectedetat: Etatvehicle[],
    setSelectedetat: (types: Etatvehicle[]) => void,
    maxSelection: number,
    label?: string,
    invalid?: boolean
  }
) {
  const [filter, setFilter] = useState<string>("");
  const [options, setOptions] = useState<Etatvehicle[]>([]);

  useEffect(() => {
    debouncedFetchTypes();
    return () => {
      debouncedFetchTypes.cancel();
    };
  }, [filter]);

  const fetchVetypes = async () => {
    try {
      const data = await getEtatByCriteria(filter);
      if (data) setOptions(data.data);
    } catch (error) {
      alert("Error fetching etat");
    }
  };

  const debouncedFetchTypes = debounce(fetchVetypes, 300);

  return (
    <div className="p-float-label">
      <MultiSelect
        invalid={invalid}
        style={{ width: "100%" }}
        value={selectedetat}
        options={options}
        onFilter={(e) => setFilter(e.filter)}
        optionLabel="name"
        filter
        onChange={(e) => setSelectedetat(e.value)}
        selectionLimit={maxSelection}
      />
      <label>{label ? label : "Choix de l'état"}</label>
    </div>
  );
}

export default GetEtat;
