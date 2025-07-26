import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Documents } from "../../models/Documents";
import { deltedocument, getdocumentsByCriteriaPaged } from "../../apicalls/apicallsDocuments";
import ScrollTable from "../../FormComponents.ts/ScrollTable";

function DocumentsByType() {
  const { typeId } = useParams<{ typeId: string }>();
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [docNumberFilter, setDocNumberFilter] = useState('');
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [id, setid] = useState(0);

  // Fetch documents when component mounts or filters change
  useEffect(() => {
    if (typeId) {
      const parsedId = parseInt(typeId);
      if (!isNaN(parsedId)) {
        fetchDocuments(parsedId);
      }
    }
  }, [typeId, docNumberFilter, page]);

  useEffect(() => {
    if (typeId) {
      const parsedId = parseInt(typeId);
      // setid(parsedId);

      if (!isNaN(parsedId)) {
        fetchDocuments(parsedId);
      }
      
    }
  }, []);

  const fetchDocuments = async (typeId: number) => {
    // if(typeId)
    // try {
    //   setLoading(true);
    //   const response = await getdocumentsByCriteriaPaged1(page, 500, docNumberFilter, typeId);
    //   if (response?.data?.data) {
    //     console.log('Documents data:', response.data.data);
    //     if (page === 1) {
    //       setDocuments(response.data.data);
    //     } else {
    //       setDocuments(prev => [...prev, ...response.data.data]);
    //     }
    //     setHasMore(response.data.data.length === 500);
    //   }
    // } catch (error) {
    //   console.error("Error fetching documents:", error);
    //   toast.current?.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Failed to fetch documents",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleDelete = async (id: number) => {
    try {
      await deltedocument(id);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Document deleted successfully",
      });
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete document",
      });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/Editdocuments/${id}`);
  };

  const filterHandlers = [setDocNumberFilter]; // Ensure this matches the number of filter fields

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Toast ref={toast} />

      <div style={{
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}>
        <h2 style={{
          fontSize: "2rem",
          fontWeight: 600,
          color: "#1a237e",
          margin: 0,
          background: "linear-gradient(45deg, #1a237e, #3949ab)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Documents par Type
        </h2>
      </div>

      <div style={{
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}>
        <ScrollTable
          style={{
            height: "calc(100vh - 400px)",
            backgroundColor: 'white',
            marginTop: '0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
          deletableRows
          deleteHandler={handleDelete}
          editableRows
          editHandler={handleEdit}
          value={documents}
          headers={["Numéro", "Type", "Date d'expiration", "Date de création", "Chauffeur", "Véhicule"]}
          fields={["doc_number", "type.name", "expiry_date", "issued_at", "chauffeur.first_name", "vehicle.licenseplate"]}
          fetchFunction={fetchDocuments}
          loading={loading}
          page={page}
          hasMore={hasMore}
          setPage={setPage}
          setHasMore={setHasMore}
          filter
          filterFields={['doc_number']}
          filterHandlers={filterHandlers}
          filterValues={[docNumberFilter]}
        />
      </div>
    </div>
  );
}

export default DocumentsByType;