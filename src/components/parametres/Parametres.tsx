import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import {
  createServiceType,
  getAllServiceTypes,
  updateServiceType,
  deleteServiceType,
} from "../../apicalls/apicallsMaintenance";
import "./Parametres.css";

export default function Parametres() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  // Service Types state
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<
    "company" | "vehicleType" | "expenseType" | "serviceType" | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [editingServiceType, setEditingServiceType] = useState<any>(null);

  // Load service types on component mount
  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      setLoading(true);
      const response = await getAllServiceTypes();
      if (response.data && response.data.success && response.data.data) {
        setServiceTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error loading service types:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger les types de dépenses",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (
    type: "company" | "vehicleType" | "expenseType" | "serviceType"
  ) => {
    setDialogType(type);
    setInputValue("");
    setDescriptionValue("");
    setEditingServiceType(null);
    setDialogVisible(true);
  };

  const handleSave = async () => {
    if (dialogType === "serviceType") {
      try {
        setLoading(true);
        if (editingServiceType) {
          // Update existing service type
          await updateServiceType(editingServiceType.id, {
            name: inputValue,
            description: descriptionValue,
          });
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Type de dépense mis à jour avec succès",
            life: 3000,
          });
        } else {
          // Create new service type
          await createServiceType({
            name: inputValue,
            description: descriptionValue,
          });
          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Type de dépense ajouté avec succès",
            life: 3000,
          });
        }

        // Reload service types
        await loadServiceTypes();
        setDialogVisible(false);
        setInputValue("");
        setDescriptionValue("");
        setEditingServiceType(null);
      } catch (error: any) {
        console.error("Error saving service type:", error);
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail:
            error.response?.data?.error ||
            "Impossible de sauvegarder le type de dépense",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Handle other types (existing logic)
      console.log("Saving:", dialogType, inputValue);
      setDialogVisible(false);
      setInputValue("");
    }
  };

  const handleEditServiceType = (serviceType: any) => {
    setEditingServiceType(serviceType);
    setInputValue(serviceType.name);
    setDescriptionValue(serviceType.description || "");
    setDialogType("serviceType");
    setDialogVisible(true);
  };

  const handleDeleteServiceType = async (id: number) => {
    try {
      await deleteServiceType(id);
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Type de dépense supprimé avec succès",
        life: 3000,
      });
      await loadServiceTypes();
    } catch (error: any) {
      console.error("Error deleting service type:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail:
          error.response?.data?.error ||
          "Impossible de supprimer le type de dépense",
        life: 3000,
      });
    }
  };

  const getDialogTitle = () => {
    switch (dialogType) {
      case "company":
        return "Ajouter une société";
      case "vehicleType":
        return "Ajouter un type de véhicule";
      case "expenseType":
      case "serviceType":
        return editingServiceType
          ? "Modifier le type de dépense"
          : "Ajouter un type de dépense";
      default:
        return "";
    }
  };

  const getInputLabel = () => {
    switch (dialogType) {
      case "company":
        return "Nom de la société";
      case "vehicleType":
        return "Type de véhicule";
      case "expenseType":
        return "Type de dépense";
      default:
        return "";
    }
  };

  return (
    <div className="parametres-container">
      <Toast ref={toast} />
      <h1>Paramètres</h1>

      <div className="parametres-grid">
        <Card className="parametres-card">
          <div className="card-content">
            <i className="pi pi-building card-icon"></i>
            <h2>Sociétés</h2>
            <Button
              label="Ajouter une société"
              icon="pi pi-plus"
              onClick={() => navigate("/companies")}
            />
          </div>
        </Card>

        <Card className="parametres-card">
          <div className="card-content">
            <i className="pi pi-car card-icon"></i>
            <h2>Types de Véhicules</h2>
            <Button
              label="Ajouter un type"
              icon="pi pi-plus"
              onClick={() => navigate("/AddVehicletype")}
            />
          </div>
        </Card>

        <Card className="parametres-card">
          <div className="card-content">
            <i className="pi pi-wallet card-icon"></i>
            <h2>Types de Dépenses</h2>
            <Button
              label="Ajouter un type"
              icon="pi pi-plus"
              onClick={() => handleAdd("serviceType")}
            />

            {serviceTypes.length > 0 && (
              <div className="service-types-table">
                <DataTable
                  value={serviceTypes}
                  loading={loading}
                  emptyMessage="Aucun type de dépense trouvé"
                  className="p-datatable-sm"
                >
                  <Column field="name" header="Nom" />
                  <Column field="description" header="Description" />
                  <Column
                    body={(rowData) => (
                      <div className="action-buttons">
                        <Button
                          icon="pi pi-pencil"
                          size="small"
                          severity="secondary"
                          onClick={() => handleEditServiceType(rowData)}
                        />
                        <Button
                          icon="pi pi-trash"
                          size="small"
                          severity="danger"
                          onClick={() => handleDeleteServiceType(rowData.id)}
                        />
                      </div>
                    )}
                    header="Actions"
                    style={{ width: "100px" }}
                  />
                </DataTable>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={getDialogTitle()}
        modal
        className="p-fluid"
        style={{ width: "500px" }}
      >
        {dialogType === "serviceType" ? (
          <>
            <div className="field">
              <label htmlFor="name">Nom du type de dépense *</label>
              <InputText
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>
          </>
        ) : (
          <div className="field">
            <label htmlFor="name">{getInputLabel()}</label>
            <InputText
              id="name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              autoFocus
            />
          </div>
        )}
        <div className="dialog-footer">
          <Button
            label="Annuler"
            icon="pi pi-times"
            outlined
            onClick={() => setDialogVisible(false)}
            disabled={loading}
          />
          <Button
            label="Sauvegarder"
            icon="pi pi-check"
            onClick={handleSave}
            loading={loading}
          />
        </div>
      </Dialog>
    </div>
  );
}
