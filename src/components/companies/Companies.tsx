import { Toast } from "primereact/toast";
import AddCompany from "./AddCompany"
import { useEffect, useRef, useState } from "react";
import { addCompany, deleteCompany, getCompaniesByCriteria, updateCompany } from "../../apicalls/apicallsCompanies";
import Companie from "../../models/Companie";
import CompaniesList from "./CompaniesList";
import EditCompany from "./EditCompany";
import { setLicensePlate } from "../../redux/addVehicleSlice";

function Companies() {

    const [companies, setCompanies] = useState<Companie[]>([])
    const [selectedCompany, setSelectedCompany] = useState<Companie | null | undefined>()
    const toast = useRef(null)
    const [loading, setLoading] = useState<boolean>(true)
    const handleAddCompany = async (name: string) => {
        if (name.length === 0) {
            (toast.current as unknown as any).show({
                severity: 'error',
                summary: 'Error',
                detail: "Le nom de l'entreprise est obligatoire"
            });

        }
        else {
            setLoading(true)

            try {
                const response = await addCompany(name);
                (toast.current as unknown as any).show({
                    severity: 'success',
                    summary: 'Ok',
                    detail: "L'entreprise a été ajoutée"
                });
                

                fetchCompanies();

            }
            catch (error: any) {
                (toast.current as unknown as any).show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message
                });
            }
            finally {
                setLoading(false)
            }

        }
    }


    const handleDeleteCompany = async (company: Companie) => {

        if (!selectedCompany) {
            (toast.current as unknown as any).show({
                severity: 'error',
                summary: 'Error',
                detail: 'Aucune entreprise sélectionnée'
            });
            return;
        }

        else {
            setLoading(true)
            try {

                await deleteCompany(selectedCompany.id);
                (toast.current as unknown as any).show({
                    severity: 'success',
                    summary: 'Ok',
                    detail: 'Entreprise supprimée'
                });
                setSelectedCompany(undefined)

                await fetchCompanies();

            }
            catch (error: any) {
                (toast.current as unknown as any).show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message
                });

            }
            finally {

                setLoading(false)

            }
        }

    }

    const handleEditCompany = async (company: Companie, newName: string) => {

        if (!selectedCompany) {
            (toast.current as unknown as any).show({
                severity: 'error',
                summary: 'Error',
                detail: 'Aucune entreprise sélectionnée'
            });
            return;
        }

        if (newName.length === 0) {
            (toast.current as unknown as any).show({
                severity: 'error',
                summary: 'Error',
                detail: 'Le nom ne peut pas être vide'
            });
            return;
        }

        setLoading(true)
        try {
            await updateCompany(company.id, newName);
            (toast.current as unknown as any).show({
                severity: 'success',
                summary: 'Ok',
                detail: 'Le nom a été modifié'
            });
            await fetchCompanies();
        }
        catch (error: any) {
            (toast.current as unknown as any).show({
                severity: 'error',
                summary: 'Error',
                detail: error.message
            });
            setLoading(false)

        }
        finally {
            setLoading(false)
        }




    }

    const fetchCompanies = async () => {
        try {

            setLoading(true)
            const response = await getCompaniesByCriteria('')
            setCompanies(response.data)

        }
        catch (error) {
            (toast.current as unknown as any).show({
                severity: 'error',
                summary: 'Error',
                detail: 'Erreur lors de la récupération des entreprises'
            });
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchCompanies();
    }, [])


    return (
        <div style={containerStyle}>

            {
                selectedCompany ? <EditCompany
                    loading={loading}
                    handleDeleteCompany={handleDeleteCompany}
                    company={selectedCompany} handleEditCompany={handleEditCompany} />
                    :
                    <AddCompany
                        loading={loading}
                        handleAddCompany={handleAddCompany} />
            }

            <div style={listStyle}>
                <CompaniesList companies={companies}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                />
            </div>

            <Toast ref={toast} position="bottom-center" />

        </div>
    )
}

const containerStyle = {
    display: "flex",
    flexDirection: "row" as const,
    gap: "2em",
    padding: "2em"
}

const listStyle = {
    width: "50vw"
}

export default Companies