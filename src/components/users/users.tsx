import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { getallusers, deleteUser, getuser } from "../../apicalls/apicallsUser";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import './users.css';

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userfilter, setFilter] = useState("");
  const toast = useRef<Toast>(null);

  const filterUsers = () => {
    const filterResponse = users.filter((item) => {
      return item.fullName.toLowerCase().includes(userfilter.toLowerCase());
    });

    setFilteredUsers(filterResponse);
  };

  useEffect(() => {
    filterUsers();
  }, [userfilter]);

  const renderHeader = () => {
    return (
      <div className="users-search">
        <div className="users-search-title">
          <i className="pi pi-users" style={{ marginRight: '0.5rem' }}></i>
          Liste des utilisateurs
        </div>
        <div className="users-search-input">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={userfilter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Rechercher par nom"
              className="p-inputtext-sm"
            />
          </span>
        </div>
      </div>
    );
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getallusers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    confirmDialog({
      message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        try {
          await deleteUser(id);
          await fetchUsers();
          toast.current?.show({
            severity: 'success',
            summary: 'Suppression réussie',
            detail: 'L\'utilisateur a été supprimé'
          });
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer cet utilisateur'
          });
        }
      }
    });
  };

  const EditUser = async (id: number) => {
    const response = await getuser(id);
    const u: User = response.data;
    navigate("/Edituser", { state: { user: u } });
  };

  // Function to map role ID to role name
  const getRoleName = (roleId: number): 'Admin' | 'User' | 'Unknown' => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      default:
        return "Unknown"; // Fallback for any unexpected role ID
    }
  };

  return (
    <div className="users-container">
      <ConfirmDialog />
      
      <div className="users-header">
        <h2 className="users-title">
          <i className="pi pi-users" style={{ marginRight: '0.75rem' }}></i>
          Gestion des utilisateurs
        </h2>
        <Button
          label="Ajouter un utilisateur"
          icon="pi pi-user-plus"
          className="p-button-raised"
          onClick={() => navigate("/Adduser")}
        />
      </div>
      
      <Card className="users-card">
        {loading ? (
          <div className="users-loading">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          </div>
        ) : error ? (
          <div className="users-error">
            <i className="pi pi-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
            {error}
          </div>
        ) : (
          <DataTable
            value={filteredUsers}
            globalFilterFields={["fullName"]}
            header={renderHeader()}
            emptyMessage="Aucun utilisateur trouvé"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="users-table"
            stripedRows
            showGridlines
            size="small"
            tableStyle={{ minWidth: '50rem' }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} à {last} sur {totalRecords} utilisateurs"
          >
            <Column field="id" header="ID" style={{ width: "8%" }} sortable />
            <Column
              field="fullName"
              header="Nom complet"
              style={{ width: "27%" }}
              sortable
              body={(row) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="pi pi-user" style={{ marginRight: '0.5rem', color: '#4361ee' }}></i>
                  {row.fullName}
                </div>
              )}
            />
            <Column
              field="email"
              header="Email"
              style={{ width: "30%" }}
              sortable
              body={(row) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="pi pi-envelope" style={{ marginRight: '0.5rem', color: '#6c757d' }}></i>
                  {row.email}
                </div>
              )}
            />
            <Column
              field="roleId"
              header="Rôle"
              style={{ width: "15%" }}
              sortable
              body={(row) => {
                const roleName = getRoleName(row.roleId);
                const roleClass = 
                  roleName === 'Admin' ? 'users-role-admin' : 
                  roleName === 'User' ? 'users-role-user' : 
                  'users-role-unknown';
                return <span className={`users-role-badge ${roleClass}`}>{roleName}</span>;
              }}
            />
            <Column
              header="Actions"
              style={{ width: "20%" }}
              body={(row) => (
                <div className="users-action-buttons">
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="info"
                    onClick={() => EditUser(row.id)}
                    tooltip="Modifier"
                    tooltipOptions={{ position: 'top' }}
                    className="p-button-raised p-button-sm"
                  />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    onClick={() => handleDeleteUser(row.id)}
                    tooltip="Supprimer"
                    tooltipOptions={{ position: 'top' }}
                    className="p-button-raised p-button-sm"
                  />
                </div>
              )}
            />
          </DataTable>
        )}
      </Card>
      
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
}

export default Users;
