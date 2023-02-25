import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { myProfile } from '../gestionarUsuarios/mockup';

const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: myProfile.firstName,
    lastName: myProfile.lastName,
    email: myProfile.email,
    dni: myProfile.dni,
    phone: myProfile.phone
  });

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <div className="mx-5 my-3">
      <div className='d-flex flex-row align-items-center justify-content-between align-text-center mb-4 w-100 px-3' >
          <div className='d-flex align-items-center align-text-center'>
            <h5 className='text-start m-0'>Datos personales</h5>
          </div>
          {ButtonCreate('Crear un nuevo usuario', () => setModalShow(true))}
        </div>
      <form
        style={{ backgroundColor: 'rgba(0,0,0,.1)' }}
        className="px-5 py-3 mb-3"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            aria-describedby="firstNameHelp"
            disabled
            style={{ cursor: 'not-allowed' }}
            value={personalInfo.firstName}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            aria-describedby="lastNamelHelp"
            disabled
            style={{ cursor: 'not-allowed' }}
            value={personalInfo.lastName}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            disabled
            style={{ cursor: 'not-allowed' }}
            value={personalInfo.email}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dni" className="form-label">
            DNI
          </label>
          <input
            type="text"
            className="form-control"
            id="dni"
            aria-describedby="emailHelp"
            disabled
            style={{ cursor: 'not-allowed' }}
            value={personalInfo.dni}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Teléfono
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            aria-describedby="emailHelp"
            value={personalInfo.phone}
            onChange={e =>
              setPersonalInfo({ ...personalInfo, phone: e.target.value })
            }
          />
        </div>
        <Button type="submit" className="btn btn-primary" style={{minWidth:300}}>
          Guardar cambios
        </Button>
      </form>
      </div>
  );
};

export default PersonalInfo;
