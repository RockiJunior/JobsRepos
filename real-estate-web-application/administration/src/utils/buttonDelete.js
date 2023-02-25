import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ButtonDelete = (funcion, data) => {
    return (
        <>
            <FontAwesomeIcon
                icon='fa-trash-can'
                title='Eliminar'
                style={{ marginRight: 4, marginLeft: 4, color: '#e63757', cursor: 'pointer' }}
                onClick={data ? () => funcion(data) : funcion} />
        </>
    )
}

export default ButtonDelete