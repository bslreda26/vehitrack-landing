import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import ScrollTable from '../../FormComponents.ts/ScrollTable';
import { Documents } from '../../models/Documents';
import { deltedocument, downloadDocument, getdocumentsByCriteria } from '../../apicalls/apicallsDocuments';
import { doctypeSeederValues } from '../../models/DoctypeSeeders';
import { InputSwitch } from 'primereact/inputswitch';
import { DOCUMENT_STATUS } from '../../utils/constants';
import { Vehicle } from '../../models/Vehicle';
import { getVehicleById } from '../../apicalls/apicallsVehicle';

function VehicleDocuments() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const [documents, setDocuments] = useState<Documents[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [archived, setArchived] = useState<boolean>(false);
    const [vehicle, setVehicle] = useState<Vehicle | undefined>(undefined)


    const fetchVehicle = async () => {

        if (vehicleId) {
            try {
                const response = await getVehicleById(parseInt(vehicleId));
                setVehicle(response.data)
            }
            catch (error) {
                alert('erreur lors de la recuperation du vehicule')
            }
        }

    }


    useEffect(() => {
            fetchVehicle();
    }, [])

    const fetchDocuments = async () => {
        if (vehicleId) {

            try {
                setLoading(true)
                // const response = await getdocumentsByCriteriaPaged(page, 20,
                //     undefined, undefined, parseInt(vehicleId)
                // )
                const status = archived ? DOCUMENT_STATUS.ARCHIVED : DOCUMENT_STATUS.NOT_ARCHIVED
                const response = await getdocumentsByCriteria(undefined, undefined, status, undefined, parseInt(vehicleId), page, 20)
                if (response.data.data) {

                    if (page === 1) {
                        setDocuments(response.data.data);
                    } else {
                        setDocuments(prev => [...prev, ...response.data.data]);
                    }
                    setHasMore(response.data.data.length === 20);
                }
            }
            catch (error: any) {

                toast.current?.show({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors du chargement des documents'
                });


            }
            finally {
                setLoading(false)
            }
        }

    };

    useEffect(() => {
        fetchDocuments();
    }, [page, archived]);

    const handleDelete = async (id: number) => {
        try {
            await deltedocument(id);
            setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
            toast.current?.show({
                severity: 'success',
                summary: 'Succès',
                detail: 'Document supprimé avec succès'
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors de la suppression'
            });
        }
    };

    const handleAddDocument = () => {
        navigate(`/vehicles/${vehicleId}/add-document`);
    };

    const handleDocumentClick = async (seletedDocument: Documents) => {

        const id = seletedDocument.id;

        try {

            const response = await downloadDocument(id)
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `image_${seletedDocument.doc_image}`); // Set the desired file name
            document.body.appendChild(link);


            // Trigger the download

            link.click();


            // Clean up and remove the link
            if (link && link.parentNode)
                link.parentNode.removeChild(link);

            window.URL.revokeObjectURL(url); // Free up memory


        } catch (error: any) {
            alert(error.message)
        }



    }

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Toast ref={toast} />


            {/* Header Section */}
            <div style={{
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{
                    fontWeight: 600,
                    color: '#1a237e',
                    margin: 0
                }}>Documents du Véhicule {vehicle?.licenseplate}</h2>

                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "2em" }}>
                    <label style={{ color: "#7d7d7d" }}>Afficher les documents archivés</label>
                    <InputSwitch checked={archived} onChange={(e) => setArchived(e.value)} />

                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button
                        icon="pi pi-pencil"
                        label="Modifier le Véhicule"
                        severity="info"
                        onClick={() => navigate(`/EditVehicle/${vehicleId}`)}
                    />
                    <Button
                        icon="pi pi-plus"
                        label="Ajouter un Document"
                        severity="success"
                        onClick={handleAddDocument}
                    />
                </div>
            </div>

            {/* Documents Table */}
            <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <ScrollTable
                    style={{
                        height: "calc(100vh - 250px)",
                        backgroundColor: 'white',
                        marginTop: '0'
                    }}
                    value={documents}
                    headers={["Numéro", "Type", "Date de création", "Date d'expiration"]}
                    fields={["doc_number", "type.name", "issued_at", "expiry_date"]}
                    loading={loading}
                    page={page}
                    hasMore={hasMore}
                    setPage={setPage}
                    setHasMore={setHasMore}
                    fetchFunction={fetchDocuments}
                    onRowClick={handleDocumentClick}

                />
            </div>
        </div>
    );
}

export default VehicleDocuments;
