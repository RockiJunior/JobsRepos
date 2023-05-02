import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Toasts from 'helpers/Toasts'
import React from 'react'
import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { confirmAccount, recoveryPassword } from 'redux/colabsSlice'

const RestablecerContraseña = () => {
    //Variables para gestion de password
    const [password, setPassword] = useState('')

    const [repeatPassword, setRepeatPassword] = useState ('')

    const [validPassword, setValidPassword] = useState(false)

    const [showPassword, setShowPassword] = useState({
        password: false,
        repeat: false
    })

    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]\\:;'<>,.?/])(?!.*\s).{8,16}$/

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const token = params?.token

    //Handlers
    const handlePassword = (e) => {
        setPassword(e.target.value)
        setValidPassword(passwordPattern.test(e.target.value))
    }

    const handleRepeat = (e) => {
        setRepeatPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const data = {recoveryToken: token, password: password, confirmPassword: repeatPassword}
            await dispatch(recoveryPassword(data))
            navigate('/ingresar')
        }catch (e){
            return e
        }
    }

    const handleViewPassword = (e) => {
        setShowPassword({
            ...showPassword,
            password: !showPassword.password
        })
    }

    const handleViewRepeat = () => {
        setShowPassword({
            ...showPassword,
            repeat: !showPassword.repeat
        })
    }
    
    return (
        <div className='mx-5 my-3 d-flex flex-column align-items-center'>
            <h1 className="mb-5 text-center">¡Recuperá tu cuenta!</h1>
            <h5 className='mb-2 text-center'>Para finalizar, debés ingresar una nueva contraseña, la cual debe tener:</h5>
            <h5 className='text-center'>entre 8 y 16 dígitos, al menos 1 mayúscula, 1 número y 1 símbolo.</h5>
            <div className='d-flex flex-column align-items-center w-100 my-4'>
                <InputGroup className='mb-3' hasValidation style={{width:'50%', maxWidth: 550}}>
                    <Form.Control 
                    type={showPassword.password ? 'text' : 'password'} 
                    placeholder="Ingrese su contraseña"
                    required 
                    onChange={handlePassword} 
                    isValid={password && validPassword} 
                    isInvalid={password && !validPassword}
                    />
                    <InputGroup.Text
                    className="px-2"
                    onClick={(e) => handleViewPassword(e)}
                    style={{
                    width: '13%',
                    justifyContent: 'center',
                    alignItems: 'center'
                    }}
                    >
                        <FontAwesomeIcon
                        icon={showPassword.password ? 'eye-slash' : 'eye'}
                        style={{ cursor: 'pointer' }}
                        />
                    </InputGroup.Text>
                    {password && !validPassword &&
                    <Form.Control.Feedback type="invalid">
                        No cumple los requisitos
                    </Form.Control.Feedback>}
                </InputGroup>
                <InputGroup className='mb-3' hasValidation style={{width:'50%', maxWidth: 550}}>
                    <Form.Control 
                    type={showPassword.repeat ? 'text' : 'password'} 
                    required 
                    placeholder="Repita su contraseña"
                    onChange={handleRepeat} 
                    isValid={repeatPassword && password === repeatPassword} 
                    isInvalid={repeatPassword && password !== repeatPassword}
                    />
                    <InputGroup.Text
                    className="px-2"
                    onClick={handleViewRepeat}
                    style={{
                    width: '13%',
                    justifyContent: 'center',
                    alignItems: 'center'
                    }}
                    >
                        <FontAwesomeIcon
                        icon={showPassword.repeat ? 'eye-slash' : 'eye'}
                        style={{ cursor: 'pointer' }}
                        />
                    </InputGroup.Text>
                    {password !== repeatPassword &&
                    <Form.Control.Feedback type="invalid">
                        Las contraseñas deben coincidir
                    </Form.Control.Feedback>}
                </InputGroup>
            </div>
            <Button onClick={handleSubmit} type="submit">Confirmar contraseña</Button>
        </div>
    )
}

export default RestablecerContraseña