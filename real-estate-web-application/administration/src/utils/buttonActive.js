import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ButtonActive = (funcion, data) => {
    return (
        <>
            <FontAwesomeIcon
                icon='fa-power-off'
                size='sm'
                title='Activar'
                style={{ marginRight: 4, marginLeft: 4, color: '#00d97e', cursor: 'pointer' }}
                onClick={data ? () => funcion(data) : funcion}
            />
        </>
    )
}

export default ButtonActive