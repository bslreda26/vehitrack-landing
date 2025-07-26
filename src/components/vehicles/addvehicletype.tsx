import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import car2 from "./../../assets/car2.png";
import { Button } from "primereact/button";
import {
  addType,
  deleteVetype,
  getallTypes,
  getVetypesById,
  updateVetype,
} from "../../apicalls/apicallsVetype";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import "./vehicletype.css";

interface VehicleType {
  id: number;
  name: string;
}

function AddVehicletype() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ name: "" });
  const [types, setTypes] = useState<VehicleType[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [rowId, setRowId] = useState<number | null>(null);
  const toast = useRef<Toast>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ name: "" });

    if (!name) {
      setErrors({ name: "Name is required." });
      return;
    }

    try {
      if (isEdit && rowId !== null) {
        await updateVetype(rowId, name);
        toast.current?.show({
          severity: 'success',
          summary: 'Opération réussie',
          detail: 'Le type a bien été modifié'
        });      } else {
        await addType(name);
        toast.current?.show({
          severity: 'success',
          summary: 'Opération réussie',
          detail: 'Le type a bien été ajouté'
        });
      }
      resetForm();
      await showTypes();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setIsEdit(false);
    setRowId(null);
  };

  const showTypes = async () => {
    try {
      const response = await getallTypes();
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };

  useEffect(() => {
    showTypes();
  }, []);

  const handleDeleteUser = async (id: number) => {
    confirmDialog({
      message: 'Êtes-vous sûr de vouloir supprimer ce type de véhicule?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        try {
          await deleteVetype(id);
          await showTypes();
          toast.current?.show({
            severity: 'success',
            summary: 'Suppression réussie',
            detail: 'Le type de véhicule a été supprimé'
          });
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer ce type, car il est déjà associé à des véhicules'
          });
        }
      }
    });
  };

  const editUser = async (id: number) => {
    setIsEdit(true);
    setRowId(id);
    const response = await getVetypesById(id);
    setName(response.data.name);
  };

  return (
    <div className="vehicle-type-container">
      <ConfirmDialog />
      <div className="vehicle-type-header">
        <img src={car2} alt="Car" />
        <h2>Types de véhicules</h2>
      </div>

      <div className="vehicle-type-content">
        <div className="vehicle-type-card">
          <form onSubmit={handleSubmit} className="vehicle-type-form">
            <div className="vehicle-type-input-group">
              <FloatLabel>
                <InputText
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? 'p-invalid w-full' : 'w-full'}
                />
                <label htmlFor="name">Type de véhicule</label>
              </FloatLabel>
              {errors.name && <div className="vehicle-type-error">{errors.name}</div>}
            </div>

            <div className="vehicle-type-button-group">
              {isEdit && (
                <Button 
                  label="Annuler" 
                  icon="pi pi-times" 
                  severity="secondary" 
                  onClick={resetForm} 
                />
              )}
              <Button 
                label={isEdit ? 'Modifier' : 'Ajouter'}
                type="submit"
                icon={isEdit ? 'pi pi-pencil' : 'pi pi-plus'}
                severity={isEdit ? 'info' : 'success'}
              />
            </div>
          </form>
        </div>

        <div className="vehicle-type-table-card">
          <DataTable
            value={types}
            className="vehicle-type-table"
            emptyMessage="Aucun type de véhicule trouvé"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column field="name" header="Nom" style={{ width: '70%' }} />
            <Column
              header="Actions"
              style={{ width: '30%' }}
              body={(rowData) => (
                <div className="vehicle-type-action-buttons">
                  <Button
                    type="button"
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    severity="info"
                    onClick={() => editUser(rowData.id)}
                    tooltip="Modifier"
                    tooltipOptions={{ position: 'top' }}
                  />
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => handleDeleteUser(rowData.id)}
                    tooltip="Supprimer"
                    tooltipOptions={{ position: 'top' }}
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
      
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
}

export default AddVehicletype;
