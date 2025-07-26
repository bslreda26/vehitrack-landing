import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import MaintenanceDashboard from "./MaintenanceDashboard";
import MaintenanceList from "./MaintenanceList";
import MaintenanceForm from "./MaintenanceForm";

import "./maintenance.css";

const Maintenance: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="maintenance-container">
      <Routes>
        <Route path="/" element={<MaintenanceDashboard />} />
        <Route path="/list" element={<MaintenanceList />} />
        <Route path="/add" element={<MaintenanceForm />} />
        <Route path="/edit/:id" element={<MaintenanceForm />} />
        <Route
          path="*"
          element={
            <Card className="p-4 text-center">
              <h2>Page Non Trouvée</h2>
              <p>La page de dépense que vous recherchez n'existe pas.</p>
              <Button
                label="Retour au Tableau de Bord"
                onClick={() => navigate("/maintenance")}
              />
            </Card>
          }
        />
      </Routes>
    </div>
  );
};

export default Maintenance;
