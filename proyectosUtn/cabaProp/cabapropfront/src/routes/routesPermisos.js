import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route } from 'react-router-dom'
import GestionarRoles from 'sites/admin/inmobiliario/gestionarRoles/GestionarRoles'
import CrearRol from 'sites/admin/inmobiliario/gestionarRoles/modals/CrearRol'
import EditRol from 'sites/admin/inmobiliario/gestionarRoles/modals/EditRol'
import GestionarUsuarios from 'sites/admin/inmobiliario/gestionarUsuarios/GestionarUsuarios'
import { HavePermission } from 'utils/HavePermission'

const RoutesPermisos = () => {
    const token = localStorage.getItem("token")

    return (
        <Route path='/permisos'>
            <Route
                path="/permisos/roles"
                element={token === null ? <Navigate to={'/ingresar'} /> : <GestionarRoles />}
            />
            <Route
                path="/permisos/roles/crear"
                element={token === null ? <Navigate to={'/ingresar'} /> : <CrearRol />}
            />
            <Route
                path="/permisos/roles/editar/:id"
                element={token === null ? <Navigate to={'/ingresar'} /> : <EditRol />}
            />
            <Route
                path="/permisos/usuarios"
                element={token === null ? <Navigate to={'/ingresar'} /> : <GestionarUsuarios />}
            />
        </Route>
    )
}

export default RoutesPermisos