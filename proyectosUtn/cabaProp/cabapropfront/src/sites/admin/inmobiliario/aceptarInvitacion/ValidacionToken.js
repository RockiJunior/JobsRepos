import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getInvitation } from 'redux/colabsSlice'

const ValidarToken = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const session = localStorage.getItem("token")
    useEffect(() => {
        if (session !== null) navigate('/errors/sesion-iniciada')
    },[session])

    const params = useParams()
    const token = params.token

    const invitacion = useSelector((state) => state.colabs.invitacion)

    useEffect(() => {
        dispatch(getInvitation(token))
    },[token])

    
    const date = new Date()
    const ahora = date.getSeconds()
    
    useEffect(() => {
        const expiredAt = invitacion?.expired_at
        const expires = new Date(expiredAt)
        const isExpired = ahora >= expires
        if (expiredAt && !isExpired) {
            navigate(`/confirmar-registro/${token}`)
        } else if (expiredAt && isExpired || invitacion === ''){
            navigate('/errors/invitacion-invalida')
        }
    },[invitacion])

    return (
        <div></div>
    )
}

export default ValidarToken