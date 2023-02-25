import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ButtonDisable = (funcion, data) => {
    return (
        <>
            <FontAwesomeIcon
                icon='fa-pause'
                title='Deshabilitar'
                style={{ marginRight: 4, marginLeft: 4, color: '#02a8b5', cursor: 'pointer' }}
                onClick={data ? () => funcion(data) : funcion} />
        </>
    )
}

export default ButtonDisable