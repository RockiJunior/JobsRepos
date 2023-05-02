import { SingleItem } from 'components/Home/components/SingleItem';
import React from 'react';

const getShortcuts = (user, routes, eventos) => {
  const filterRoutes = route => {
    switch (route.visible) {
      case 'actividadComercial':
        return user?.datos?.actividadComercial;

      case 'eventosLength':
        return !!eventos?.length;

      default:
        if (route.visible) {
          return true;
        } else if (route.children) {
          return route.children.some(filterRoutes);
        } else {
          return false;
        }
    }
  };

  return (
    <>
      {routes
        .filter(filterRoutes)
        .map(({ children, name, icon, to, visible }, index) => {
          return (
            <React.Fragment key={`route-${index}`}>
              {visible && to && <SingleItem icon={icon} name={name} to={to} />}
              {children && getShortcuts(user, children)}
            </React.Fragment>
          );
        })}
    </>
  );
};

export default getShortcuts;
