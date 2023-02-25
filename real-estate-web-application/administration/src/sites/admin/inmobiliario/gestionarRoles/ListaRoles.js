import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import ButtonCreate from 'utils/buttonCreate';
import ButtonDelete from 'utils/buttonDelete';
import ButtonEdit from 'utils/buttonEdit';

const ListaRoles = ({ listaRoles, openDelete }) => {
    const navigate = useNavigate()

    const handleNavigate = (id) => {
        navigate(`/permisos/roles/editar/${id}`)
    }

    return (
        <div className='w-100'>
            <div className='d-flex flex-row align-items-center justify-content-between align-text-center mb-4 w-100 px-3'>
                <div className='d-flex align-items-center align-text-center'>
                    <FontAwesomeIcon icon='fa-solid fa-list' className='text-dark' style={{ marginRight: 10, fontSize: 20 }} />
                    <h5 className='text-start m-0'>Lista de roles</h5>
                </div>
                {ButtonCreate('Crear un nuevo rol', () => navigate('/permisos/roles/crear'))}
            </div>
            <div className='d-flex flex-row flex-wrap' >
                {listaRoles.map(({ name, id }) => {
                    return (
                        <div
                            className='d-flex justify-content-end align-items center text-align-center me-4 mb-4 px-4 py-3 border rounded-4 border-light-5'
                            key={id}
                        >
                            <h6 className='d-flex flex-row m-0 pt-1 text-align-center' >{name}</h6>
                            &nbsp;&nbsp;
                            <div>
                                {ButtonEdit(handleNavigate, id)}
                                &nbsp;&nbsp;
                                {ButtonDelete(openDelete, { name: name, id: id })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ListaRoles