import React from 'react'
import {toast} from 'react-toastify'

const messageHandler = (type, message) => {
    return (
        toast[type](message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
    )
}

export default messageHandler