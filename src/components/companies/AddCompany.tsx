import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { addCompany } from "../../apicalls/apicallsCompanies";

function AddCompany(
    {
        handleAddCompany,
        loading
    }
        :
        {
            handleAddCompany: (name: string) => void,
            loading? : boolean
        }
) {


    const [name, setName] = useState<string>('')






    return (
        <div style={containerStyle}>
            <div className="p-float-label" >
                <InputText
                    style={{ width: "100%" }}
                    value={name}
                    placeholder="Nom de l'entreprise"
                    onChange={(event) => setName(event.target.value)}
                />

                <label>Nom de l'entreprise</label>

            </div>
            <Button
                loading={loading}
                severity="success"
                icon='pi pi-plus'
                label="Ajouter"
                onClick={() => handleAddCompany(name)} />


        </div>
    )

}

const containerStyle = {

        display: "flex",
    flexDirection: "column" as const,
    gap: '2em',
    maxWidth: "25vw",
    borderRadius: "0.3em",
    padding: "2em"
}

export default AddCompany;