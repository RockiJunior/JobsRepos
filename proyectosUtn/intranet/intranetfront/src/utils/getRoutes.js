import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { checkArea, checkPermissions } from './checkPermissionsArea';

const getRoutes = (user, routes) => {
  return user ? (
    <>
      {routes.map(({ to, element, areas, permissions, children }, index) => {
        const getRoute = () => {
          if (areas && permissions) {
            return checkPermissions(permissions, user.empleado) &&
              checkArea(areas, user.empleado) ? (
              <Route path={to} element={element} />
            ) : null;
          } else if (areas) {
            return checkArea(areas, user.empleado) ? (
              <Route path={to} element={element} />
            ) : null;
          } else if (permissions) {
            return checkPermissions(permissions, user.empleado) ? (
              <Route path={to} element={element} />
            ) : null;
          } else {
            return <Route path={to} element={element} />;
          }
        };
        return (
          <React.Fragment key={`route-${index}`}>
            {to && getRoute()}
            {children && getRoutes(user, children)}
          </React.Fragment>
        );
      })}
    </>
  ) : (
    routes.map(({ to, children }, index) => (
      <React.Fragment key={`route-${index}`}>
        {to && <Route path={to} element={<Navigate to="/login" replace />} />}
        {children && getRoutes(user, children)}
      </React.Fragment>
    ))
  );
};

export default getRoutes;
