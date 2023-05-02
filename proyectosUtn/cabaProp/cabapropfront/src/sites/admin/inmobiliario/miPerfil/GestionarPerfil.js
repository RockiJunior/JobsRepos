import React, { useEffect, useState } from 'react';
import CambiarContraseña from './CambiarContraseña';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatosPersonales from './DatosPersonales';
import MisRoles from './MisRoles';
import { InfoUsuario } from './InfoUsuario';

const GestionarPerfil = () => {
  const [data, setData] = useState();

  //Check session
  const userLogged = useSelector(state => state.login.currentUser);

  useEffect(() => {
    if (userLogged) {
      const { id, firstName, lastName, phoneNumber, dni, email, photo } = userLogged;
      const profilePhoto = photo ? `${process.env.REACT_APP_CLIENT}${photo}` : 'https://res.cloudinary.com/dvaleelub/image/upload/w_1000,ar_1:1,c_fill,g_auto/v1679510961/oficinista_nysmui.jpg'
      setData({ id, firstName, lastName, phoneNumber, dni, email, profilePhoto });
    }
  }, [userLogged]);

  return (
    <div className="ms-4">
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className="d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-7">
            <h4 className="m-0">
              <FontAwesomeIcon
                icon="fa-user"
                className="text-primary"
                style={{ marginRight: 10 }}
              />
              Información personal
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item href="#" active>
                Información personal
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div
            className="my-3 w-100 d-flex flex-wrap"
            style={{ gap: 20 }}
          >
            {data && <InfoUsuario data={data} />}
            {data && <DatosPersonales data={data} />}
            {data && <CambiarContraseña id={data.id} />}
            {userLogged?.typeOfUser !== 'admin' && userLogged?.roles && userLogged?.roles.length > 0 && userLogged?.branchOffices && userLogged?.branchOffices.length > 0 && (
              <MisRoles
                roles={userLogged?.roles}
                sucursales={userLogged?.branchOffices}
              />
            )}
          </div>
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </div>
  );
};

export default GestionarPerfil;
