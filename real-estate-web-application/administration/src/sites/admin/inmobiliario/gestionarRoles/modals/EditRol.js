import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FalconComponentCard from 'components/common/FalconComponentCard'
import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getPermisos } from 'redux/permisosSlice'
import { editRol, getRoles } from 'redux/rolesSlice'
import ButtonClose from 'utils/buttonClose'
import ButtonSuccessSubmit from 'utils/buttonSuccessSubmit'
import { permissionId } from '../mockup'
import Permisos from '../Permisos'

const EditRol = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const pathLoc = window.location.pathname
    const idRol = pathLoc.substring(pathLoc.lastIndexOf('/') + 1)
    const listaRoles = useSelector((state) => state.roles.data)
    const tablaPermisos = useSelector((state) => state.permisos.data)
    const token = localStorage.getItem("token")
    const [errors, setErrors] = useState({
        errorFound: false,
        alert: null
    })

    useEffect(() => {
        dispatch(getPermisos(token))
        dispatch(getRoles(token))
    }, [])

    useEffect(() => {
        if (listaRoles.length > 0) {
            const rolData = listaRoles.filter((rol) => rol.id === parseInt(idRol))
            const list = { ...permissionId }
            rolData[0]?.roleToPermission?.map((permKey) => {
                list[permKey.permission.id] = true
            })
            setRolEdit({
                id: rolData[0]?.id,
                inmobiliaria: rolData[0]?.realEstate?.id,
                nombre: rolData[0]?.name,
                permisos: { ...list }
            })
        }
    }, [listaRoles])

    const [rolEdit, setRolEdit] = useState({
        id: '',
        inmobiliaria: '',
        nombre: '',
        permisos: { ...permissionId }
    })

    const handleSwitchEdit = (e) => {
        setRolEdit({
            ...rolEdit,
            permisos: {
                ...rolEdit.permisos,
                [e.target.id]: !rolEdit.permisos[e.target.id]
            }
        })
    }

    useEffect(() => {
        if (rolEdit.nombre.length < 2) {
            setErrors({
                errorFound: true,
                alert: 'Ingrese un nombre con mínimo 2 letras.'
            })
        } else if (listaRoles && listaRoles.some((element) => element.name === rolEdit.nombre && element.id !== rolEdit.id)) {
            setErrors({
                errorFound: true,
                alert: 'El nombre ingresado ya está en uso.'
            })
        } else {
            setErrors({
                errorFound: false,
                alert: null
            })
        }
    }, [rolEdit.nombre])

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            if (!errors.errorFound) {
                await dispatch(editRol(rolEdit, token))
                setRolEdit({
                    nombre: '',
                    inmobiliaria: '',
                    id: '',
                    permisos: {}
                })
                navigate('/permisos/roles')
            }
        } catch (e) {
            console.log(e)
            return e
        }
    };

    const handleCancel = async (e) => {
        try {
            e.preventDefault()
            navigate(-1)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='ms-4'>
            <FalconComponentCard>
                <FalconComponentCard.Body>
                    <div className='d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-5'>
                        <h4 className='m-0'>
                            <FontAwesomeIcon icon='fa-pen-to-square' style={{ marginRight: 10, color: '#fd7e14' }} />
                            Editar un rol
                        </h4>
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={() => navigate('/gestionar-roles')}>
                                Gestionar roles
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="#" active>
                                Editar rol
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <form className='d-flex flex-column justify-content-start' onSubmit={handleEdit}>
                        <div style={{ maxWidth: 350 }} className="my-4 ms-4">
                            <h5 className='text-center mb-2'>Ingrese el nombre <label>*</label></h5>
                            <input
                                type="text"
                                className="form-control form-control-sm mb-2"
                                required
                                id="firstname"
                                aria-describedby="firstnamelHelp"
                                placeholder="Nombre"
                                value={rolEdit.nombre}
                                onChange={(e) =>
                                    setRolEdit({ ...rolEdit, nombre: e.target.value })
                                }
                            />
                            {errors.errorFound &&
                                <label className='text-center text-danger w-100'>{errors.alert}</label>}
                        </div>

                        <div className='d-flex flex-column align-items-start'>
                            <h5 className="mb-5 ms-4">Seleccionar permisos</h5>
                            <div className="d-flex flex-wrap justify-content-start ms-4">
                                {tablaPermisos.map(({ name, permissions }, index) => (
                                    <Permisos
                                        key={index}
                                        rol={rolEdit}
                                        name={name}
                                        permissions={permissions}
                                        handleSwitch={handleSwitchEdit}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='d-flex flex-row justify-content-end w-100' style={{ gap: 50 }}>
                            {ButtonClose('Cancelar', handleCancel)}
                            {ButtonSuccessSubmit('Guardar cambios', errors.errorFound)}
                        </div>
                    </form>
                </FalconComponentCard.Body>
            </FalconComponentCard>
        </div>
    )
}

export default EditRol