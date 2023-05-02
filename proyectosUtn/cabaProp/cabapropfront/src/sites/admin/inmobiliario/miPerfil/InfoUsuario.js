import React from 'react';
import Avatar from 'components/common/Avatar';
import FalconCardBody from 'components/common/FalconCardBody';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useSelector } from 'react-redux';

export const InfoUsuario = ({ data }) => {
  const userLogged = useSelector(state => state.login.currentUser);
  const inmobiliariaImage =
    'https://res.cloudinary.com/dvaleelub/image/upload/v1679507941/inmobiliaria_sxlzrw.jpg';

  return (
    <FalconComponentCard style={{ width: 436 }}>
      {data && (
        <FalconCardBody className="bg-white" noLight={true}>
          <div
            className="d-flex flex-column align-items-center w-100"
            style={{ gap: 5 }}
          >
            <img
              src={inmobiliariaImage}
              style={{ maxWidth: '50%', height: 'auto' }}
            />
            <div>
              <Avatar
                size="4xl"
                src={data.profilePhoto}
                name={data.firstName + ' ' + data.lastName}
              />
            </div>
            <div
              className="d-flex flex-column align-items-center"
              style={{ gap: 2 }}
            >
              <label className="m-0" style={{ fontSize: 15 }}>
                {data.firstName} {data.lastName}
              </label>
              <div className="d-flex flex-column align-items-center">
                {userLogged &&
                  userLogged.typeOfUser !== 'admin' &&
                  userLogged.branchOffices &&
                  userLogged.branchOffices.length > 0 &&
                  userLogged.branchOffices.map(
                    ({ branch_office_name, id }, index) => {
                      return (
                        <label key={id} className="m-0">
                          {branch_office_name}, Calle Falsa 1{id}5{index}
                        </label>
                      );
                    }
                  )}
              </div>
              <label className="m-0">
                <a href={`mailto:${data.email}`}>{data.email}</a>
              </label>
            </div>
          </div>
        </FalconCardBody>
      )}
    </FalconComponentCard>
  );
};
