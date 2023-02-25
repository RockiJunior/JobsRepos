import React from 'react'

const Permiso = ({rol, permiso, handleSwitch}) => {
    return (
        <div className="form-check form-switch w-100 px-3 py-1 ps-6">
            <input
                className="form-check-input"
                type="checkbox"
                id={permiso.id}
                onChange={handleSwitch}
                checked={rol.permisos[permiso.id]}
            />
            <h6 className="form-check-label" htmlFor="sucursal1">
                {permiso.permissionName}
            </h6>
            {/* <label>{permiso.permissionDescription}</label> */}
        </div>            
    )
}

export default Permiso