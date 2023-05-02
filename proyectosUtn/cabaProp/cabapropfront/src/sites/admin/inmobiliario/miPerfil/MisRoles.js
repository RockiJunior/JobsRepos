import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FalconCardBody from 'components/common/FalconCardBody';
import FalconCardHeader from 'components/common/FalconCardHeader';
import FalconComponentCard from 'components/common/FalconComponentCard';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const MisRoles = ({ roles, sucursales }) => {
  const [openRole, setOpenRole] = useState();
  const rolesUser = useSelector(state => state.roles.rolesById);
  const handleOpen = index => {
    if (index === openRole) setOpenRole();
    else setOpenRole(index);
  };

  return (
    <FalconComponentCard style={{ width: 436 }}>
      <FalconComponentCard.Header noPreview className="bg-ligth">
        <h5>Mis roles</h5>
      </FalconComponentCard.Header>
      <FalconCardBody className="bg-white" noLight={true}>
        {sucursales &&
          sucursales?.map((sucu, index) => {
            return (
              <div
                key={index}
                className="my-2 mx-2"
                onClick={() => handleOpen(index)}
              >
                <div className="d-flex">
                  <FontAwesomeIcon
                    className="pe-2 fa-sm"
                    style={{paddingTop: 2}}
                    icon={`fa-solid fa-chevron-${
                      openRole === index ? 'down' : 'right'
                    }`}
                  />
                  <label>
                    {rolesUser[sucu.role_id]?.name} ({sucu.branch_office_name})
                  </label>
                </div>
                {openRole === index && (
                  <ul
                    className="d-flex flex-row flex-wrap"
                    style={{ maxWidth: 380, gap: 5 }}
                  >
                    {rolesUser &&
                      rolesUser[sucu.role_id].roleToPermission.map(
                        (perm, index) => (
                          <li key={index} style={{ inlineSize: 170 }}>
                            <label>{perm.permission.permissionName}</label>
                          </li>
                        )
                      )}
                  </ul>
                )}
              </div>
            );
          })}
      </FalconCardBody>
    </FalconComponentCard>
  );
};

export default MisRoles;
