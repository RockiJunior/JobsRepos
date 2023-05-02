import { SingleItem } from 'components/Home/components/SingleItem';
import React from 'react';
import { checkArea, checkPermissions } from './checkPermissionsArea';

const getShortcuts = (user, routes) => {
  return (
    <>
      {routes.map(
        ({ areas, permissions, children, name, icon, to, visible }, index) => {
          const getShorcut = () => {
            if (name === 'Inicio') return null;

            if (areas && permissions) {
              return checkPermissions(permissions, user.empleado) &&
                checkArea(areas, user.empleado) ? (
                <SingleItem icon={icon} name={name} to={to} />
              ) : null;
            } else if (areas) {
              return checkArea(areas, user.empleado) ? (
                <SingleItem icon={icon} name={name} to={to} />
              ) : null;
            } else if (permissions) {
              return checkPermissions(permissions, user.empleado) ? (
                <SingleItem icon={icon} name={name} to={to} />
              ) : null;
            } else {
              return <SingleItem icon={icon} name={name} to={to} />;
            }
          };

          return (
            <React.Fragment key={`route-${index}`}>
              {visible && to && getShorcut()}
              {children && getShortcuts(user, children)}
            </React.Fragment>
          );
        }
      )}
    </>
  );
};

export default getShortcuts;
