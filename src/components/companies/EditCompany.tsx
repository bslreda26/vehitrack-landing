import { useState } from "react"
import Companie from "../../models/Companie"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"

function EditCompany(
    {
        company,
        handleEditCompany,
        handleDeleteCompany,
        loading
    }
        :
        {
            company: Companie,
            handleEditCompany: (company: Companie, newName: string) => void,
            handleDeleteCompany: (company: Companie) => void,
            loading?: boolean
        }
) {


    const [name, setName] = useState<string>(company.name ? company.name : '')






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
                icon='pi pi-pencil'
                label="Modifier"
                severity="secondary"
                onClick={() => handleEditCompany(company, name)} />

            <Button
                loading={loading}
                icon='pi pi-trash'
                label='Supprimer'
                severity='danger'
                onClick={() => handleDeleteCompany(company)} />


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
export default EditCompany