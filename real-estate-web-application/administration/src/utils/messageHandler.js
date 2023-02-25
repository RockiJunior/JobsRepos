import React from 'react'
import {toast} from 'react-toastify'

const messageHandler = (type, message) => {
    return (
        toast[type](message, {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
    )
}

export default messageHandler