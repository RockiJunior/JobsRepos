import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ButtonResend = (funcion, data ) => {
    return (
        <>
            <FontAwesomeIcon
                icon='fa-rotate-right'
                title= 'Reenviar'
                style={{ marginRight: 4, marginLeft: 4, color: '#6b5eae', cursor: 'pointer' }}
                onClick={data ? () => funcion(data) : funcion}
            />
        </>
    )
}

export default ButtonResend