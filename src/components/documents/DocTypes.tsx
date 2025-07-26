import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getalldoctypes, adddoctype, deletedoctype, updatedoctype } from '../../apicalls/apicalldoctype';
import { Doctype } from '../../models/Doctype';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';

export default function DocTypes() {
  const [docTypes, setDocTypes] = useState<Doctype[]>([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [newDocType, setNewDocType] = useState<{ id: number, name: string }>({ id: 0, name: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDocTypes();
  }, []);

  const loadDocTypes = async () => {
    try {
      setLoading(true);
      const response = await getalldoctypes();
      if (response.data) {
        setDocTypes(response.data);
      }
    } catch (error: any) {
      console.error('Error loading document types:', error);
      showError(error.response?.data?.message || 'Erreur lors du chargement des types de documents');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Succès',
      detail: message,
      life: 3000
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Erreur',
      detail: message,
      life: 5000
    });
  };

  const openNew = () => {
    setNewDocType({ id: 0, name: '' });
    setEditMode(false);
    setDisplayDialog(true);
  };

  const hideDialog = () => {
    setDisplayDialog(false);
    setNewDocType({ id: 0, name: '' });
    setSubmitting(false);
  };

  const validateForm = (): boolean => {
    if (!newDocType.name.trim()) {
      showError('Le nom du type de document est obligatoire');
      return false;
    }
    return true;
  };

  const saveDocType = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      if (editMode) {
        const response = await updatedoctype(newDocType.id, newDocType.name);
        if (response.data) {
          showSuccess('Type de document modifié avec succès');
          hideDialog();
          await loadDocTypes();
        }
      } else {
        const response = await adddoctype(newDocType.name);
        if (response.data) {
          showSuccess('Type de document ajouté avec succès');
          hideDialog();
          await loadDocTypes();
        }
      }
    } catch (error: any) {
      console.error('Error saving document type:', error);
      showError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const editDocType = (rowData: Doctype) => {
    setNewDocType({ id: rowData.id, name: rowData.name });
    setEditMode(true);
    setDisplayDialog(true);
  };

  const confirmDelete = (rowData: Doctype) => {
    confirmDialog({
      message: 'Êtes-vous sûr de vouloir supprimer ce type de document ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(rowData.id),
      reject: () => {}
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await deletedoctype(id);
      if (response.status === 200) {
        showSuccess('Type de document supprimé avec succès');
        await loadDocTypes();
      }
    } catch (error: any) {
      console.error('Error deleting document type:', error);
      showError(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };



  const actionBodyTemplate = (rowData: Doctype) => {
    return (
      <div className="flex gap-2 justify-content-center">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          tooltip="Modifier"
          tooltipOptions={{ position: 'top' }}
          onClick={() => editDocType(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          tooltip="Supprimer"
          tooltipOptions={{ position: 'top' }}
          onClick={() => confirmDelete(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <div className="flex gap-2">
        <Button
          label="Nouveau"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />

      </div>
     
        <InputText
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Rechercher par nom"
        />
     
    </div>
  );

  const filteredDocTypes = docTypes.filter(dt => 
    dt.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  const dialogFooter = (
    <React.Fragment>
      <Button
        label="Annuler"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
        className={classNames('p-button-text', { 'p-disabled': submitting })}
      />
      <Button
        label="Enregistrer"
        icon="pi pi-check"
        onClick={saveDocType}
        loading={submitting}
      />
    </React.Fragment>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      <Card title="Types de Documents">
        <DataTable
          ref={dt}
          value={filteredDocTypes}
          loading={loading}
          header={header}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          dataKey="id"
          filters={{ global: { value: nameFilter, matchMode: 'contains' } }}
          globalFilterFields={['name']}
          emptyMessage="Aucun type de document trouvé"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
          className="p-datatable-sm"
        >
          <Column
            field="name"
            header="Nom"
            sortable
            filter
            filterPlaceholder="Rechercher par nom"
            style={{ minWidth: '14rem' }}
          />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '8rem', textAlign: 'center' }}
          />
        </DataTable>
      </Card>

      <Dialog
        visible={displayDialog}
        style={{ width: '450px' }}
        header={editMode ? "Modifier Type de Document" : "Nouveau Type de Document"}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={hideDialog}
        closeOnEscape={!submitting}
        closable={!submitting}
        dismissableMask={!submitting}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Nom
          </label>
          <InputText
            id="name"
            value={newDocType.name}
            onChange={(e) => setNewDocType({ ...newDocType, name: e.target.value })}
            required
            autoFocus
            className={classNames({ 'p-invalid': !newDocType.name.trim() })}
            disabled={submitting}
          />
          {!newDocType.name.trim() && (
            <small className="p-error">Le nom est obligatoire.</small>
          )}
        </div>
      </Dialog>
    </div>
  );
}
