import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonSuccessSubmit = (text, disabled) => {
    return (
        <Button 
        className='d-flex align-items-center justify-content-center' 
        variant={disabled ? "secondary" : "success"}
        disabled={disabled}
        size='sm'
        style={{cursor: disabled ? "not-allowed" : "pointer"}}
        type='submit'>
            <FontAwesomeIcon icon='fa-check' style={{marginRight:5}} />
            &nbsp;
            <span style={{marginRight:10}}>{text}</span>
        </Button>
    )
}

export default ButtonSuccessSubmit