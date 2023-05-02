import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import GestionarAvisos from 'sites/admin/inmobiliario/gestionarAvisos/GestionarAvisos';
import GestionarPropiedades from 'sites/admin/inmobiliario/gestionarPropiedades/GestionarPropiedades';
import WizardAuth from 'sites/admin/inmobiliario/gestionarPropiedades/WizardAuth';
import { HavePermission } from 'utils/HavePermission';

const RoutesPropiedades = userLogged => {
  return (
    userLogged && (
      <>
        <Route path="/propiedades" element={<GestionarPropiedades />} />

        <Route path="/propiedades/consultas" element={<GestionarAvisos />} />

        <Route
          path="/propiedades/cargar"
          element={
            HavePermission('Create properties', userLogged) ? (
              <WizardAuth statusType="crear" />
            ) : (
              <Navigate to={'/errors/permisos'} />
            )
          }
        />

        <Route
          path="/propiedades/editar/:id"
          element={
            HavePermission('Edit properties', userLogged) ? (
              <WizardAuth statusType="editar" />
            ) : (
              <Navigate to={'/errors/permisos'} />
            )
          }
        />
      </>
    )
  );
};

export default RoutesPropiedades;
