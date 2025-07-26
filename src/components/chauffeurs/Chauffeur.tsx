import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { getallusers, deleteUser, getuser } from "../../apicalls/apicalls";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { getAllByAltText } from "@testing-library/react";
import { deletechauffeur, getAllChauffeur, getChauffeurByCriteria, getChauffeurByCriteriaPaged } from "../../apicalls/apiCallsChauffeur";
import { setCommentRange } from "typescript";
import { Chauffeur as ChauffeurModel } from "../../models/Chauffeur";

import { debounce, has, last } from "lodash";
import { Skeleton } from "primereact/skeleton";
import { setDefaultResultOrder } from "dns";
import { lutimes } from "fs";
import GetChauffeur from "../../FormComponents.ts/GetChauffeur";
import { setFips } from "crypto";
import ScrollTable from "../../FormComponents.ts/ScrollTable";
import { Toast } from "primereact/toast";

function Chauffeur() {

  const [chauffeurs, setchauffeurs] = useState<ChauffeurModel[]>([])
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [firstNameFilter, setFirstNameFilter] = useState<string>('')
  const [lastNameFilter, setLastNameFilter] = useState<string>('')
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const fetchChauffeurs = async () => {
    try {
      setLoading(true);
      const response = await getChauffeurByCriteriaPaged(firstNameFilter, '', '', page, 20);
      if (response.data.data) {
        if (page === 1) {
          setchauffeurs(response.data.data);
        } else {
          setchauffeurs(prev => [...prev, ...response.data.data]);
        }
        setHasMore(response.data.data.length === 20);
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch chauffeurs'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setchauffeurs([]);
    setPage(1);
    setHasMore(true);
  }, [firstNameFilter]);

  useEffect(() => {
    fetchChauffeurs();
  }, [page]);

  const handleDelete = async (id: number) => {

    try {
      console.log(id)
      setLoading(true)

      const response = await deletechauffeur(id);
      (toast.current as any).show({ severity: 'success', summary: 'ok', detail: 'Chaffeur supprimé' });


      setchauffeurs(chauffeurs.filter(item => {
        return item.id !== id
      }))


    }
    catch (error) {
      (toast.current as any).show({ severity: 'error', summary: 'ok', detail: 'Echec de la suppression' });

    }
    finally {
      setLoading(false)
    }

  }

  const handleEdit = (id: number) => {
    navigate(`/EditChauffeur/${id}`);
  };

  const tableStyle = {
    height: "calc(100vh - 250px)",
    backgroundColor: 'white',
    '& .header-row': {
      backgroundColor: '#e3f2fd',
    },
    '& th': {
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
      fontWeight: 600,
      padding: '1rem',
    }
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
    }}>
      <Toast ref={toast} />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          margin: 0,
          color: '#2c3e50',
          fontSize: '1.75rem',
          fontWeight: 600
        }}>Chauffeurs Management</h2>
        <Button
          label="Add Chauffeur"
          icon="pi pi-plus"
          severity="success"
          onClick={() => navigate('/addchauffeur')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px'
          }}
        />
      </div>

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
          deletableRows
          deleteHandler={handleDelete}
          editableRows
          editHandler={handleEdit}
          value={chauffeurs}
          headers={["First Name", "Last Name", "companie"]}
          fetchFunction={fetchChauffeurs}
          fields={["first_name", "last_name", "companie.name"]}
          loading={loading}
          page={page}
          hasMore={hasMore}
          setPage={setPage}
          setHasMore={setHasMore}
          filter
          filterFields={['first_name']}
          filterHandlers={[setFirstNameFilter]}
          filterValues={[firstNameFilter]}
        />
      </div>
    </div>
  );
}

export default Chauffeur;
