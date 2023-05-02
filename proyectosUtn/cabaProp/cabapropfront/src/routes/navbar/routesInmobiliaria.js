export const inmobiliariaRoutes = [
  /* {
    label: 'Principal',
    labelDisable: false,
    children: [
      {
        name: 'Panel',
        icon: 'home',
        key: 'public',
        to: '/',
        active: false,
        exact: true
      },
      {
        name: 'Estadísticas',
        icon: 'chart-pie',
        key: 'public',
        to: '/estadisticas',
        active: false,
        exact: true
      } 
    ]
  }, */
  {
    label: 'Propiedades',
    groupKey: 'Properties',
    labelDisable: false,
    children: [
      {
        name: 'Listar',
        icon: 'list',
        key: 'See properties',
        to: '/propiedades',
        active: false,
        exact: true
      },
      {
        name: 'Nueva propiedad',
        icon: 'building',
        key: 'Create properties',
        to: '/propiedades/cargar',
        active: false,
        exact: true
      },
      {
        name: 'Consultas',
        icon: 'message',
        key: 'Messages',
        to: '/propiedades/consultas',
        active: false,
        exact: true
      }
    ]
  },
  {
    label: 'Permisos',
    labelDisable: false,
    groupKey: 'Permissions',
    children: [
      {
        name: 'Usuarios',
        icon: 'users',
        key: 'Users',
        to: '/permisos/usuarios',
        active: false,
        exact: true
      },
      {
        name: 'Roles',
        icon: 'shield-halved',
        key: 'Roles',
        to: '/permisos/roles',
        active: false,
        exact: true
      }
    ]
  },
  {
    label: 'Configuración',
    labelDisable: false,
    groupKey: 'public',
    children: [
      {
        name: 'Perfil',
        icon: 'user',
        key: 'public',
        to: '/perfil',
        active: false,
        exact: true
      }
    ]
  }
]

export default [inmobiliariaRoutes];
