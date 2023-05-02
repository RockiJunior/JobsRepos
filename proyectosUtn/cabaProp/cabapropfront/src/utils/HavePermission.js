export const HavePermission = (action, userLogged, branchOffice) => {
  if (userLogged && userLogged.typeOfUser === 'admin') {
    return true;
  } else if (userLogged && userLogged.roles && userLogged.roles.length) {
    const { roles } = userLogged;
    switch (action) {
      //Case NavBar vertical labels
      case 'Properties': {
        const canSeeProperties = roles && roles.length;
        return canSeeProperties;
        /* 
        const seePropertiesLabel = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.group === 'Propiedad' || perm.group === 'Mensajeria' || perm.group === 'Roles' || perm.group === 'Usuarios');
            } else {
              return false;
            }
          }
        );
        return seePropertiesLabel.some(perm => perm === true); */
      }
      case 'Permissions': {
        const seePermissionsLabel = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(
                perm => perm.group === 'Roles' || perm.group === 'Usuarios'
              );
            } else {
              return false;
            }
          }
        );
        return seePermissionsLabel.some(perm => perm === true);
      }
      //Case de usuarios
      case 'Users': {
        const usersPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.group === 'Usuarios');
            } else {
              return false;
            }
          }
        );
        return usersPermissionFound.some(perm => perm === true);
      }
      case 'Create users': {
        const usersPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'usuarios.crear');
            } else {
              return false;
            }
          }
        );
        return usersPermissionFound.some(perm => perm === true);
      }
      case 'Edit users': {
        const usersPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'usuarios.editar');
            } else {
              return false;
            }
          }
        );
        return usersPermissionFound.some(perm => perm === true);
      }
      case 'Delete users': {
        const usersPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'usuarios.delete');
            } else {
              return false;
            }
          }
        );
        return usersPermissionFound.some(perm => perm === true);
      }
      //Case de roles
      case 'Roles': {
        const rolesPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.group === 'Roles');
            } else {
              return false;
            }
          }
        );
        return rolesPermissionFound.some(perm => perm === true);
      }
      case 'Create roles': {
        const usersPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'roles.crear');
            } else {
              return false;
            }
          }
        );
        return usersPermissionFound.some(perm => perm === true);
      }
      case 'Edit roles': {
        const usersPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'roles.crear');
            } else {
              return false;
            }
          }
        );
        return usersPermissionFound.some(perm => perm === true);
      }
      case 'Delete roles': {
        const usersPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'roles.crear');
            } else {
              return false;
            }
          }
        );
        return usersPermissionFound.some(perm => perm === true);
      }
      //Case de mensajes
      case 'Messages': {
        const messagesPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.group === 'Mensajeria');
            } else {
              return false;
            }
          }
        );
        return messagesPermissionFound.some(perm => perm === true);
      }
      case 'See properties': {
        const canSeeProperties = roles && roles.length > 0;
        return canSeeProperties;
      }
      //Case de Propiedades
      case 'Create properties': {
        const createPropertiesPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'propiedad.crear');
            } else {
              return false;
            }
          }
        );
        return createPropertiesPermissionFound.some(perm => perm === true);
      }
      case 'Edit properties': {
        const editPropertiesPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(perm => perm.key === 'propiedad.editar');
            } else {
              return false;
            }
          }
        );
        return editPropertiesPermissionFound.some(perm => perm === true);
      }
      case 'Delete properties': {
        const deletePropertiesPermissionFound = roles.map(
          ({ branch_office_id, permissions }) => {
            if (!branchOffice || branchOffice === branch_office_id) {
              return permissions.some(
                perm => perm.key === 'propiedad.eliminar'
              );
            } else {
              return false;
            }
          }
        );
        return deletePropertiesPermissionFound.some(perm => perm === true);
      }
    }
  } else {
    return false;
  }
};
