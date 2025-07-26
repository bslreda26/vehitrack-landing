import { DataTable } from "primereact/datatable"
import Companie from "../../models/Companie"
import { Column } from "primereact/column"

function CompaniesList(
    {
        companies,
        selectedCompany,
        setSelectedCompany
    }
        :
        {
            companies: Companie[],
            selectedCompany: Companie | null | undefined,
            setSelectedCompany: (company: Companie | null |undefined) =>void
        }
) {

    return (
        <div>
            <DataTable value={companies}
            selectionMode='single'
            selection={selectedCompany}
            onSelectionChange={(e) => setSelectedCompany((e.value)as Companie)}

            >
                <Column header='Nom' field="name" />
                
            </DataTable>
        </div>
    )



}

export default CompaniesList