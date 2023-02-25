import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonCreate = (text, funcion) => {
    return (
        <Button 
            className='d-flex align-items-center align-text-center' 
            variant="success" 
            onClick={funcion}
            size='sm'
            >
            <FontAwesomeIcon icon='fa-plus'/>
            &nbsp;
            <span style={{ marginRight: 10 }}>{text}</span>
        </Button>
    )
}

export default ButtonCreate