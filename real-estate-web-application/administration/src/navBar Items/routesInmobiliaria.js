export const inmobiliariaRoutes = [
  {
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
  },
  {
    label: 'Propiedades',
    labelDisable: false,
    children: [
      {
        name: 'Listar',
        icon: 'list',
        key: 'public',
        to: '/propiedades',
        active: false,
        exact: true
      },
      {
        name: 'Nueva propiedad',
        icon: 'building',
        key: 'public',
        to: '/propiedades/cargar',
        active: false,
        exact: true
      },
      {
        name: 'Consultas',
        icon: 'message',
        key: 'public',
        to: '/propiedades/consultas',
        active: false,
        exact: true
      }
    ]
  },
  {
    label: 'Permisos',
    labelDisable: false,
    children: [
      {
        name: 'Usuarios',
        icon: 'users',
        key: 'public',
        to: '/permisos/usuarios',
        active: false,
        exact: true
      },
      {
        name: 'Roles',
        icon: 'shield-halved',
        key: 'public',
        to: '/permisos/roles',
        active: false,
        exact: true
      }
    ]
  },
  {
    label: 'Configuración',
    labelDisable: false,
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
