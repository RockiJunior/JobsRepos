import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ButtonView = (funcion, data) => {
    return (
        <>
            <FontAwesomeIcon
                icon='fa-eye' 
                style={{ marginRight: 4, marginLeft: 4, color: '#2c7be5', cursor: 'pointer' }}
                title='Ver detalles'
                onClick={data ? () => funcion(data) : funcion} />
        </>
    )
}

export default ButtonView