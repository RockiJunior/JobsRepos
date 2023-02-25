import Wizard from 'components/wizard/Wizard'
import React from 'react'
import { Navigate, Route } from 'react-router-dom'
import GestionarAvisos from 'sites/admin/inmobiliario/gestionarAvisos/GestionarAvisos'
import GestionarPropiedades from 'sites/admin/inmobiliario/gestionarPropiedades/GestionarPropiedades'
import WizardAuth from 'sites/admin/inmobiliario/gestionarPropiedades/WizardAuth'

const RoutesPropiedades = () => {
    const token = localStorage.getItem("token")

    return (
        <Route
          path="/propiedades"
        >
          <Route path='/propiedades/' element={token === null ? <Navigate to={'/ingresar'} /> : <GestionarPropiedades />} />
          <Route path='/propiedades/consultas' element={token === null ? <Navigate to={'/ingresar'} /> : <GestionarAvisos />} />
          <Route path="/propiedades/cargar" element={token === null ? <Navigate to={'/ingresar'} /> : <WizardAuth statusType="crear" />}>
            <Route
              path="/propiedades/cargar"
              element={<Wizard validation={true} />}
            />
          </Route>
          <Route path="/propiedades/editar/:id" element={token === null ? <Navigate to={'/ingresar'} /> : <WizardAuth statusType="editar" />}>
            <Route
              path="/propiedades/editar/:id"
              element={<Wizard validation={true} />}
            />
          </Route>
        </Route>
    )
}

export default RoutesPropiedades