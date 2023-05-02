export const checkRoutePermissionsArea = (route, empleado) => {
  const area = empleado.area.id;
  const routeAreas = route.areas;

  const permissions = empleado.permisos;
  const routePermissions = route.permissions;

  if (routeAreas && !routeAreas.includes(area)) {
    return false;
  }

  if (routePermissions) {
    for (const routePermission of routePermissions) {
      if (Array.isArray(routePermission)) {
        let hasPermission = false;
        for (const permission of routePermission) {
          if (permissions.includes(permission)) {
            hasPermission = true;
            break;
          }
        }
        if (!hasPermission) {
          return false;
        }
      } else if (!permissions.includes(routePermission)) {
        return false;
      }
    }
  }

  return true;
};

export const checkArea = (areas, empleado) => {
  const empleadoArea = empleado.area.id;
  return areas.includes(empleadoArea);
};

export const checkPermissions = (routePermissions, empleado) => {
  const permissions = empleado.permisos;
  for (const routePermission of routePermissions) {
    if (Array.isArray(routePermission)) {
      let hasPermission = false;
      for (const permission of routePermission) {
        if (permissions.includes(permission)) {
          hasPermission = true;
          break;
        }
      }
      if (!hasPermission) {
        return false;
      }
    } else if (!permissions.includes(routePermission)) {
      return false;
    }
  }
  return true;
};
