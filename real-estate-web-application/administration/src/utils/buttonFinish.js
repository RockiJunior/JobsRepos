import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ButtonFinish = (funcion, data) => {
    return (
        <>
            <FontAwesomeIcon
                icon={faFlagCheckered}
                title='Finalizar'
                style={{ marginRight: 4, marginLeft: 4, color: '#0b1727', cursor: 'pointer' }}
                onClick={data ? () => funcion(data) : funcion} />
        </>
    )
}

export default ButtonFinish