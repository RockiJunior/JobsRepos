import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const MisRoles = ({ roles, sucursales }) => {
    const [openRole, setOpenRole] = useState()
    const rolesUser = useSelector(state => state.roles.rolesById)
    const handleOpen = index => {
        if (index === openRole) setOpenRole()
        else setOpenRole(index)
    }
    
    return (
        <div className='d-flex flex-column align-items-start align-text-center justify-content-between align-text-center mb-3 w-100 px-3' >
            <h5 className='text-start mb-3'>Mis roles</h5>
            <div>
                {sucursales && sucursales?.map((sucu, index) => {
                    return (
                        <div key={index} className="my-2 mx-5" onClick={() => handleOpen(index)}>
                            <div className='d-flex'>
                                <FontAwesomeIcon className='pe-2 pt-1'
                                    icon={`fa-solid fa-chevron-${openRole === index ? "down" : "right"}`} />
                                <p>{rolesUser[sucu.role_id]?.name} ({sucu.branch_office_name})</p>
                            </div>
                            {
                                openRole === index && (
                                    <ul className='d-flex flex-row flex-wrap'>
                                        {
                                            rolesUser && rolesUser[sucu.role_id].roleToPermission.map((perm, index) => (
                                                <li key={index} style={{width:200}}><label>{perm.permission.permissionName}</label></li>
                                            ))
                                        }
                                    </ul>
                                )
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MisRoles