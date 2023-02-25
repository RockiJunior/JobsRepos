import Error404 from 'components/errors/Error404'
import Error500 from 'components/errors/Error500'
import ErrorLayout from 'layouts/ErrorLayout'
import React from 'react'
import { Route } from 'react-router-dom'
import InvitacionInvalida from 'sites/admin/inmobiliario/aceptarInvitacion/InvitacionInvalida'
import SesionIniciada from 'sites/admin/inmobiliario/aceptarInvitacion/SesionAbierta'

const RoutesErrors = () => {
    return (
        <Route path='/errors'>
            <Route element={<ErrorLayout />}>
                <Route path="/errors/404" element={<Error404/>} />
                <Route path="/errors/500" element={<Error500 />} />
            </Route>

            <Route path="/errors/invitacion-invalida" element={<InvitacionInvalida />} />
            <Route path="/errors/sesion-iniciada" element={<SesionIniciada />} />
        </Route>
    )
}

export default RoutesErrors