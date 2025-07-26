// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { deltedocument, getAllDocuments, getdocumentsByCriteriaPaged } from "../apicalls/apicallsDocuments";
// import { Documents } from "../models/Documents";
// import { Toast } from "primereact/toast";
// import ScrollTable from "../FormComponents.ts/ScrollTable";
// import { Button } from "primereact/button";
// import axios from "axios";
// import AxiosSingleton from "../apicalls/AxiosInstance";

import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton";
import React, { useEffect, useState } from "react";
import { Documents } from "../models/Documents";

import { DOCUMENT_STATUS } from "../utils/constants";
import { getAllDocuments, getdocumentsByCriteria } from "../apicalls/apicallsDocuments";
import { Toast } from "primereact/toast";
import ScrollTable from "../FormComponents.ts/ScrollTable";
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { debounce, flatMap, set } from "lodash";
import GetDocumentTypes from "../FormComponents.ts/GetDocumentTypes";
import GetVehicles from "../FormComponents.ts/GetVehicles";
import { Vehicle } from "../models/Vehicle";
import "./dashboard.css";


interface Item {
  name: string;
  value: number;
}


function Dashboard() {

  const items: Item[] = [
    { name: 'Tous', value: DOCUMENT_STATUS.ALL },
    { name: 'Valides', value: DOCUMENT_STATUS.VALID },
    { name: 'Expiration proche', value: DOCUMENT_STATUS.EXPIRES_SOON },
    { name: 'Expirés', value: DOCUMENT_STATUS.EXPIRED },
    { name: 'Archivés', value: DOCUMENT_STATUS.ARCHIVED },
  ];
  const [value, setValue] = useState<number>(DOCUMENT_STATUS.ALL); // Initialize with ALL documents
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const toast = React.createRef<Toast>();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [numberOfDaysVisible, setNumberOfDaysVisible] = useState<boolean>(false)
  const [numberOfDays, setNumberOfDays] = useState<number>(15)
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState<boolean>(false)
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<number | null>(null)
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([])
  const fetchDocuments = async () => {


    setLoading(true)
    try {
      const filterValue = searchFilter.length > 0 ? searchFilter : undefined
      const typeId = selectedDocumentTypeId ? selectedDocumentTypeId : undefined
      const vehicle_id = selectedVehicles[0] ? selectedVehicles[0].id : undefined
      const response = await getdocumentsByCriteria(filterValue, typeId,
        value, numberOfDays, vehicle_id
      );
      setDocuments(response.data.data);
      setHasMore(response.data.meta.current_page !== response.data.meta.last_page);
      const test = response.data.meta;

    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch all documents'
      });
    }
    finally {
      setLoading(false)
    }


  }

  useEffect(() => {

    if (value == DOCUMENT_STATUS.EXPIRES_SOON) {
      setNumberOfDaysVisible(true)
      return;
    }
    debouncedFetchDocuments();

    return (() => {
      debouncedFetchDocuments.cancel();
    })
  }, [value, searchFilter])


  const debouncedFetchDocuments = debounce(fetchDocuments, 300)




  const handleConfimrDays = () => {
    setNumberOfDaysVisible(false);
    fetchDocuments();
  }
  return (
    <div className="dashboard-container" style={{
      display: "flex",
      flexDirection: "column" as const,
      gap: "2em",
      width: "100vw",
    }}>
   

      <div className="filter-section" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div className="filter-label">
          <i className="pi pi-filter" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>
          <span>Filtrer par statut:</span>
        </div>
        <SelectButton
          value={value}
          onChange={(e) => setValue(e.value)}
          optionLabel="name"
          options={items}
          multiple={false}
          className="status-filter-buttons"
        />
      </div>

      <div className="search-section" style={{
        width: '80vw',
        margin: "0 auto",
        display: "flex",
        flexDirection: "row" as const,
        gap: "1em"
      }}>
        <div className="search-input-wrapper">
          <span className="p-input-icon-left" style={{ width: '100%' }}>
            <i className="pi pi-search" />
            <InputText
              placeholder="Recherche par numéro de document"
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ width: "100%", borderRadius: '8px' }}
              className="search-input"
            />
          </span>
        </div>
        <Button
          icon='pi pi-sliders-h'
          onClick={() => setAdvancedSearchVisible(true)}
          className="advanced-search-button"
          tooltip="Recherche avancée"
          tooltipOptions={{ position: 'top' }}
        />

        <Dialog
          header="Recherche avancée"
          visible={advancedSearchVisible}
          style={{ width: '450px', borderRadius: '12px' }}
          onHide={() => { if (!advancedSearchVisible) return; setAdvancedSearchVisible(false); }}
          className="advanced-search-dialog"
          breakpoints={{ '960px': '80vw', '640px': '90vw' }}
          draggable={false}
        >
          <div className="advanced-search-content">
            <div className="search-field-group">
              <label className="field-label">Véhicule</label>
              <div className="field-with-clear">
                <GetVehicles
                  maxSelection={1}
                  setVehicles={setSelectedVehicles}
                  vehicles={selectedVehicles}
                />
                {selectedVehicles.length > 0 && (
                  <Button
                    icon='pi pi-times'
                    className="clear-button"
                    onClick={() => setSelectedVehicles([])}
                    tooltip="Effacer"
                  />
                )}
              </div>
            </div>

            <div className="search-field-group">
              <label className="field-label">Type de document</label>
              <div className="field-with-clear">
                <GetDocumentTypes
                  value={selectedDocumentTypeId}
                  onChange={setSelectedDocumentTypeId}
                />
                {selectedDocumentTypeId && (
                  <Button
                    icon='pi pi-times'
                    className="clear-button"
                    onClick={() => setSelectedDocumentTypeId(null)}
                    tooltip="Effacer"
                  />
                )}
              </div>
            </div>

            <div className="dialog-footer">
              <Button
                label="Appliquer les filtres"
                icon='pi pi-check'
                onClick={() => {
                  setAdvancedSearchVisible(false);
                  fetchDocuments();
                }}
                className="apply-filters-button"
              />
            </div>
          </div>
        </Dialog>
      </div>

      <div className="table-container">
        <ScrollTable
          style={{
            height: "calc(100vh - 260px)",
            backgroundColor: 'white',
            marginTop: '0',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
          value={documents}
          headers={["Numéro", "Type", "Véhicule", "Date de création", "Date d'expiration"]}
          fields={["doc_number", "type.name", "vehicle.licenseplate", "issued_at", "expiry_date"]}
          loading={loading}
          page={page}
          hasMore={hasMore}
          setPage={setPage}
          setHasMore={setHasMore}
          fetchFunction={fetchDocuments}
        />
      </div>

      <Dialog
        header="Choisir la période d'expiration"
        visible={numberOfDaysVisible}
        style={{ width: '400px', borderRadius: '12px' }}
        onHide={() => { if (!numberOfDaysVisible) return; setNumberOfDaysVisible(false); }}
        className="days-dialog"
        draggable={false}
      >
        <div style={{
          display: "flex",
          flexDirection: "column" as const,
          gap: '2em',
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div className="p-float-label" style={{ width: "100%", marginBottom: '1.5rem' }}>
            <InputNumber
              locale="fr"
              style={{ width: "100%" }}
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.value ? e.value : 1)}
              min={1}
              max={365}
              showButtons
              buttonLayout="horizontal"
              decrementButtonClassName="p-button-secondary"
              incrementButtonClassName="p-button-secondary"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
            <label>Nombre de jours avant expiration</label>
          </div>

          <Button
            style={{ width: "100%" }}
            onClick={() => handleConfimrDays()}
            label='Appliquer'
            icon='pi pi-check'
            className="apply-days-button"
          />
        </div>
      </Dialog>

      <Toast ref={toast} position="bottom-right" />
    </div>
  );
}

export default Dashboard;