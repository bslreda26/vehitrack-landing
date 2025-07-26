import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";

import {
  addMaintenance,
  updateMaintenance,
  getMaintenanceById,
  getAllServiceTypes,
} from "../../apicalls/apicallsMaintenance";
import { getVehicleById } from "../../apicalls/apicallsVehicle";
import { MaintenanceRecord } from "../../models/MaintenanceRecord";
import GetVehicles from "../../FormComponents.ts/GetVehicles";
import "./modern-form.css";

const MaintenanceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const initialFormState: MaintenanceRecord = {
    vehicleId: 0,
    serviceTypes: [],
    description: "",
    serviceProvider: "",
    cost: 0,
    odometerReading: 0,
    serviceDate: new Date().toISOString(),
    nextServiceOdometer: undefined,
    nextServiceDate: undefined,
    partsReplaced: undefined,
    notes: undefined,
    receiptImage: undefined,
  };

  const [formData, setFormData] = useState<MaintenanceRecord>(initialFormState);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
  const [serviceDate, setServiceDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadServiceTypes();
    if (isEditMode) {
      loadMaintenanceRecord();
    }
  }, [id, isEditMode]);

  const loadServiceTypes = async () => {
    try {
      const response = await getAllServiceTypes();
      console.log("Service types response:", response.data);

      if (Array.isArray(response.data)) {
        setServiceTypes(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setServiceTypes(response.data.data);
      } else {
        console.warn(
          "Unexpected service types response format:",
          response.data
        );
        setServiceTypes([]);
      }
    } catch (error) {
      console.error("Error loading service types:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Échec du chargement des types de service",
        life: 5000,
      });
      setServiceTypes([]);
    }
  };

  const loadMaintenanceRecord = async () => {
    try {
      setLoading(true);
      const response = await getMaintenanceById(parseInt(id!));

      if (response.data) {
        const record = response.data;
        setFormData(record);

        // Set service date
        if (record.serviceDate) {
          setServiceDate(new Date(record.serviceDate));
        }

        // Set next service date if available
        if (record.nextServiceOdometer) {
          // Estimate next service date based on odometer difference
          const currentOdometer = record.odometerReading || 0;
          const nextOdometer = record.nextServiceOdometer;
          const kmDifference = nextOdometer - currentOdometer;

          // Estimate 6 months for 10,000 km (adjust as needed)
          const estimatedMonths = Math.round((kmDifference / 10000) * 6);
          const estimatedDate = new Date(record.serviceDate);
          estimatedDate.setMonth(estimatedDate.getMonth() + estimatedMonths);

          // setNextServiceDate(estimatedDate); // Removed nextServiceDate state
        }

        // Fetch and set the selected vehicle
        if (record.vehicleId) {
          try {
            const vehicleResponse = await getVehicleById(record.vehicleId);
            if (vehicleResponse.data) {
              const vehicle = vehicleResponse.data;
              setSelectedVehicles([vehicle]);
            }
          } catch (vehicleError) {
            console.error("Error loading vehicle:", vehicleError);
          }
        }
      }
    } catch (error) {
      console.error("Error loading maintenance record:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Échec du chargement de l'enregistrement de dépense",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: any, fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: e.value,
    }));
  };

  const handleVehicleChange = (vehicles: any[]) => {
    setSelectedVehicles(vehicles);
    if (vehicles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        vehicleId: vehicles[0].id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        vehicleId: 0,
      }));
    }
  };

  const handleServiceTypeChange = (e: any) => {
    const selectedType = e.value;
    if (selectedType) {
      setFormData((prev) => ({
        ...prev,
        serviceTypes: [selectedType],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        serviceTypes: [],
      }));
    }
  };

  const handleServiceDateChange = (e: any) => {
    const date = e.value;
    setServiceDate(date);
    setFormData((prev) => ({
      ...prev,
      serviceDate: date ? date.toISOString() : "",
    }));
  };

  // Removed handleNextServiceDateChange function

  const validateForm = (): boolean => {
    let isValid = true;

    // Véhicule est requis
    if (!formData.vehicleId) {
      isValid = false;
    }

    // Type de service est requis
    if (!formData.serviceTypes || formData.serviceTypes.length === 0) {
      isValid = false;
    }

    // Description est requise
    if (!formData.description) {
      isValid = false;
    }

    // Prestataire de service est requis
    if (!formData.serviceProvider) {
      isValid = false;
    }

    // Date de service est requise
    if (!formData.serviceDate) {
      isValid = false;
    }

    setFormSubmitted(true);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please fill in all required fields",
        life: 5000,
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare the form data - API calls will handle conversion to backend format
      const payload: MaintenanceRecord = {
        ...formData,
        cost:
          formData.cost !== null && formData.cost !== undefined
            ? formData.cost
            : 0,
        odometerReading:
          formData.odometerReading !== null &&
          formData.odometerReading !== undefined
            ? formData.odometerReading
            : 0,
        nextServiceOdometer:
          formData.nextServiceOdometer !== null &&
          formData.nextServiceOdometer !== undefined &&
          formData.nextServiceOdometer !== 0
            ? formData.nextServiceOdometer
            : undefined,
        serviceTypes: formData.serviceTypes || [],
      };

      if (isEditMode) {
        await updateMaintenance(parseInt(id!), payload);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Enregistrement de dépense mis à jour avec succès",
          life: 3000,
        });
      } else {
        await addMaintenance(payload);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Enregistrement de dépense ajouté avec succès",
          life: 3000,
        });
      }

      // Navigate back to maintenance list after a short delay
      setTimeout(() => {
        navigate("/maintenance");
      }, 2000);
    } catch (error) {
      console.error("Error saving maintenance record:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Échec de l'enregistrement de la dépense",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/maintenance");
  };

  if (loading && isEditMode) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="maintenance-form-container">
      <Toast ref={toast} />

      {/* Clean Header */}
      <div className="modern-form-header">
        <div className="flex justify-content-between align-items-center bg-gradient-to-r text-white">
          <div className="flex align-items-center gap-3">
            <div className="bg-white text-primary border-circle w-3rem h-3rem flex align-items-center justify-content-center">
              <i className={`pi ${isEditMode ? "pi-pencil" : "pi-plus"}`} />
            </div>
            <div>
              <h2 className="m-0 font-semibold text-xl">
                {isEditMode ? "Modifier la Dépense" : "Nouvelle Dépense"}
              </h2>
              <p className="mt-1 mb-0 text-white-alpha-90 text-sm">
                {isEditMode
                  ? "Mettre à jour les informations"
                  : "Créer un nouvel enregistrement"}
              </p>
            </div>
          </div>
          <Button
            icon="pi pi-times"
            className="p-button-text p-button-rounded"
            style={{ color: "white" }}
            onClick={handleCancel}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="modern-maintenance-form">
        {/* Section 1: Basic Information */}
        <Card className="form-section-card">
          <div className="section-header">
            <h3>
              <span className="section-number">1</span>
              <i className="pi pi-info-circle"></i>
              Informations de Base
            </h3>
            <div className="section-divider"></div>
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="vehicle" className="modern-label">
                  <i className="pi pi-car"></i>
                  Véhicule *
                </label>
                <div className="modern-input-wrapper">
                  <GetVehicles
                    vehicles={selectedVehicles}
                    setVehicles={handleVehicleChange}
                    maxSelection={1}
                  />
                  {formSubmitted && !formData.vehicleId && (
                    <small className="modern-error">
                      <i className="pi pi-exclamation-triangle"></i>
                      Véhicule est requis
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="serviceType" className="modern-label">
                  <i className="pi pi-wrench"></i>
                  Type de Service *
                </label>
                <div className="modern-input-wrapper">
                  <Dropdown
                    value={
                      serviceTypes.find(
                        (type) =>
                          formData.serviceTypes &&
                          formData.serviceTypes.some((st) => st.id === type.id)
                      ) || null
                    }
                    options={serviceTypes}
                    onChange={handleServiceTypeChange}
                    optionLabel="name"
                    placeholder="Sélectionner un type"
                    className={`modern-dropdown ${
                      formSubmitted &&
                      (!formData.serviceTypes ||
                        formData.serviceTypes.length === 0)
                        ? "p-invalid"
                        : ""
                    }`}
                    disabled={loading}
                  />
                  {formSubmitted &&
                    (!formData.serviceTypes ||
                      formData.serviceTypes.length === 0) && (
                      <small className="modern-error">
                        <i className="pi pi-exclamation-triangle"></i>
                        Type de service requis
                      </small>
                    )}
                </div>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="serviceDate" className="modern-label">
                  <i className="pi pi-calendar"></i>
                  Date de Service *
                </label>
                <div className="modern-input-wrapper">
                  <Calendar
                    value={serviceDate}
                    onChange={handleServiceDateChange}
                    dateFormat="dd/mm/yy"
                    showIcon
                    className={`modern-calendar ${
                      formSubmitted && !formData.serviceDate ? "p-invalid" : ""
                    }`}
                    disabled={loading}
                  />
                  {formSubmitted && !formData.serviceDate && (
                    <small className="modern-error">
                      <i className="pi pi-exclamation-triangle"></i>
                      Date de service requise
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="serviceProvider" className="modern-label">
                  <i className="pi pi-building"></i>
                  Prestataire *
                </label>
                <div className="modern-input-wrapper">
                  <InputText
                    id="serviceProvider"
                    name="serviceProvider"
                    value={formData.serviceProvider}
                    onChange={handleInputChange}
                    placeholder="Nom du garage ou technicien"
                    className={`modern-input ${
                      formSubmitted && !formData.serviceProvider
                        ? "p-invalid"
                        : ""
                    }`}
                    disabled={loading}
                  />
                  {formSubmitted && !formData.serviceProvider && (
                    <small className="modern-error">
                      <i className="pi pi-exclamation-triangle"></i>
                      Prestataire requis
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Removed Prochaine Date de Service field */}

            <div className="col-12">
              <div className="modern-field">
                <label htmlFor="description" className="modern-label">
                  <i className="pi pi-file-edit"></i>
                  Description des Travaux *
                </label>
                <div className="modern-input-wrapper">
                  <InputTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Détaillez les travaux effectués..."
                    className={`modern-textarea ${
                      formSubmitted && !formData.description ? "p-invalid" : ""
                    }`}
                    disabled={loading}
                  />
                  {formSubmitted && !formData.description && (
                    <small className="modern-error">
                      <i className="pi pi-exclamation-triangle"></i>
                      Description requise
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Cost */}
        <Card className="form-section-card">
          <div className="section-header">
            <h3>
              <span className="section-number">2</span>
              <i className="pi pi-dollar"></i>
              Coût de l'Intervention
            </h3>
            <div className="section-divider"></div>
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="cost" className="modern-label">
                  <i className="pi pi-money-bill"></i>
                  Montant (XOF)
                </label>
                <div className="modern-input-wrapper">
                  <InputNumber
                    id="cost"
                    value={formData.cost}
                    onValueChange={(e) => handleNumberChange(e, "cost")}
                    mode="currency"
                    currency="XOF"
                    locale="fr-FR"
                    className="modern-input"
                    disabled={loading}
                  />
                  <small className="field-hint">
                    <i className="pi pi-info-circle"></i>
                    Coût total en Francs CFA
                  </small>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Optional Information */}
        <Card className="form-section-card">
          <div className="section-header">
            <h3>
              <span className="section-number">3</span>
              <i className="pi pi-plus-circle"></i>
              Informations Complémentaires
              <span className="optional-badge">Optionnel</span>
            </h3>
            <div className="section-divider"></div>
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="odometerReading" className="modern-label">
                  <i className="pi pi-gauge"></i>
                  Kilométrage Actuel
                  <span className="optional-indicator">(Optionnel)</span>
                </label>
                <div className="modern-input-wrapper">
                  <InputNumber
                    id="odometerReading"
                    value={formData.odometerReading}
                    onValueChange={(e) =>
                      handleNumberChange(e, "odometerReading")
                    }
                    suffix=" km"
                    className="modern-input"
                    disabled={loading}
                    placeholder="Ex: 50000"
                  />
                  <small className="field-hint">
                    <i className="pi pi-info-circle"></i>
                    Kilométrage du véhicule au moment du service
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="nextServiceOdometer" className="modern-label">
                  <i className="pi pi-gauge"></i>
                  Prochain Kilométrage
                  <span className="optional-indicator">(Optionnel)</span>
                </label>
                <div className="modern-input-wrapper">
                  <InputNumber
                    id="nextServiceOdometer"
                    value={formData.nextServiceOdometer || undefined}
                    onValueChange={(e) =>
                      handleNumberChange(e, "nextServiceOdometer")
                    }
                    suffix=" km"
                    className="modern-input"
                    disabled={loading}
                    placeholder="Ex: 60000"
                  />
                  <small className="field-hint">
                    <i className="pi pi-info-circle"></i>
                    Kilométrage pour le prochain service (next_service_odometer)
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="partsReplaced" className="modern-label">
                  <i className="pi pi-cog"></i>
                  Pièces Remplacées
                  <span className="optional-indicator">(Optionnel)</span>
                </label>
                <div className="modern-input-wrapper">
                  <InputTextarea
                    id="partsReplaced"
                    name="partsReplaced"
                    value={formData.partsReplaced || ""}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Plaquettes, filtres, huile..."
                    className="modern-textarea"
                    disabled={loading}
                  />
                  <small className="field-hint">
                    <i className="pi pi-info-circle"></i>
                    Liste des pièces remplacées
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="modern-field">
                <label htmlFor="notes" className="modern-label">
                  <i className="pi pi-comment"></i>
                  Notes
                  <span className="optional-indicator">(Optionnel)</span>
                </label>
                <div className="modern-input-wrapper">
                  <InputTextarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Observations, recommandations..."
                    className="modern-textarea"
                    disabled={loading}
                  />
                  <small className="field-hint">
                    <i className="pi pi-info-circle"></i>
                    Observations et recommandations
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="modern-field">
                <label htmlFor="receiptImage" className="modern-label">
                  <i className="pi pi-image"></i>
                  Reçu / Facture
                  <span className="optional-indicator">(Optionnel)</span>
                </label>
                <div className="modern-input-wrapper">
                  <input
                    type="file"
                    id="receiptImage"
                    accept="image/*"
                    className="modern-file-input"
                    disabled={loading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData((prev) => ({
                            ...prev,
                            receiptImage: event.target?.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <small className="field-hint">
                    <i className="pi pi-info-circle"></i>
                    JPG, PNG, GIF - Max 5MB
                  </small>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="action-buttons-card">
          <div className="flex justify-content-between align-items-center">
            <Button
              type="button"
              label="Annuler"
              icon="pi pi-times"
              className="p-button-outlined p-button-lg"
              onClick={handleCancel}
              disabled={loading}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                label={isEditMode ? "Mettre à jour" : "Enregistrer"}
                icon={isEditMode ? "pi pi-check" : "pi pi-save"}
                className="p-button-lg"
                loading={loading}
                disabled={loading}
              />
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default MaintenanceForm;
