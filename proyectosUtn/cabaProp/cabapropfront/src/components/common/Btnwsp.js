import React from 'react';
import Logo from 'assets/img/logos/whatsapp-logo-1.png';

export const Btnwsp = () => {
  return (
    <a
      href={`https://wa.me/${process.env.REACT_APP_WSP_PHONE}?text=Hola+PlayMatch`}
      target="_blank"
      rel="noreferrer"
      cursor="pointer"
      style={{ zIndex: 100 }}
    >
      <img
        src={Logo}
        style={{
          position: 'fixed',
          bottom: 15,
          right: 15,
          width: '60px',
          height: 'auto'
        }}
        className="animate__animated animate__pulse animate__slow animate__infinite"
      />
    </a>
  );
};
