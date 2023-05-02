import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import ListaPropiedades from './tables/ListaPropiedades';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const GestionarPropiedades = () => {
  const [multipropFile, setMultipropFile] = useState();
  const token = localStorage.getItem('token');

  const handleOnchange = e => {
    const form_data = new FormData();
    form_data.append('file', e.target.files[0]);
    setMultipropFile(form_data);
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    const response = await axios({
      url: `${process.env.REACT_APP_SERVER}/properties/upload-by-csv`,
      method: 'POST',
      data: multipropFile,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  };

  return (
    <>
      {/* <div className="ms-4">
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className="d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-7">
            <h4 className="m-0">
              <FontAwesomeIcon
                icon="fa-building"
                className="text-primary"
                style={{ marginRight: 10 }}
              />
              Gestionar propiedades
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item href="#" active>
                Gestionar propiedades
              </Breadcrumb.Item>
            </Breadcrumb>
          </div> */}
      <ListaPropiedades />
      {/* <form onSubmit={e => handleOnSubmit(e)}>
            <input onChange={e => handleOnchange(e)} type="file" />
            <button type="submit">cargar propiedad</button>
          </form> */}
      {/* </FalconComponentCard.Body>
      </FalconComponentCard>
    </div> */}
    </>
  );
};

export default GestionarPropiedades;
