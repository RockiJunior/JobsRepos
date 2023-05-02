import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Toasts = ({titulo, mensaje, estado, setClose}) => {
  const [show, setShow] = useState(true);
  let bgColor = 'blue'
  let text = 'white'
  if (estado === 'success') bgColor = 'green'
  if (estado === 'error') bgColor = 'red'
  if (estado === 'alert') {
    bgColor = 'yellow' 
    text = 'black' 
  }

  return (
    <ToastContainer className='mb-6' position='bottom-center'>
      <Toast 
        show={show} 
        role="alert"
        aria-live="assertive" 
        aria-atomic="true"
        onClose={() => {
          setShow(!show)
          setClose(true)
          }
        }
      >
        <Toast.Header style={{backgroundColor:bgColor, color: text}}>
          <strong className="me-auto">{titulo}</strong>
        </Toast.Header>
        <Toast.Body>{mensaje}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

/*<div class="toast">
  <div class="toast-header">
    <img src="..." class="rounded me-2" alt="...">
    <strong class="me-auto">Bootstrap</strong>
    <small class="text-muted">11 mins ago</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    Hello, world! This is a toast message.
  </div>
</div> */

export default Toasts;
