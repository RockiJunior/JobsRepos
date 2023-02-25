import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ButtonEdit = (funcion, data) => {
    return (
        <>
            <FontAwesomeIcon
                icon='fa-pen-to-square'
                title='Editar'
                style={{ marginRight: 4, marginLeft: 4, color: '#fd7e14', cursor: 'pointer' }}
                onClick={data ? () => funcion(data) : funcion} />
        </>
    )
}

export default ButtonEdit