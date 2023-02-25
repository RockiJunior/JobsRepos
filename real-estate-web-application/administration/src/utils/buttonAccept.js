import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonAccept = (text, funcion, data, disabled) => {
    return (
        <Button
            className='d-flex align-items-center justify-content-center'
            variant={!disabled ? "success" : "secondary"}
            size='sm'
            disabled={disabled}
            onClick={data ? () => funcion(data) : funcion}
            type='submit'
            style={{ cursor: disabled ? "not-allowed" : "pointer"}}
            >
            <FontAwesomeIcon icon='fa-check' style={{ marginRight: 5}} />
            &nbsp;
            <span style={{ marginRight: 10 }}>{text}</span>
        </Button>
    )
}

export default ButtonAccept