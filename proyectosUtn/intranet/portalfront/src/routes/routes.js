export const appRoutes = {
  label: 'app',
  labelDisable: true,
  children: [
    {
      name: 'Inicio',
      icon: 'home',
      to: '/home',
      active: true,
      visible: true
    },
    {
      name: 'Mis Datos',
      icon: 'id-card',
      to: '/mis-datos',
      active: true,
      visible: true
    },
    {
      name: 'Tramites',
      icon: 'stamp',
      active: true,
      children: [
        {
          name: 'Mis tramites',
          to: '/tramites',
          active: true,
          icon: 'list',
          visible: true
        },
        {
          name: 'Nuevo tramite',
          to: '/tramites/nuevo',
          active: true,
          icon: 'plus',
          visible: true
        }
      ]
    },
    {
      name: 'Oblea',
      icon: 'print',
      to: '/oblea',
      active: true,
      visible: 'actividadComercial'
    },
    {
      name: 'Mis Turnos',
      icon: 'calendar-check',
      to: '/turnos',
      active: true,
      visible: true
    },
    {
      name: 'Solicitar Turno',
      icon: 'calendar-plus',
      to: '/solicitar-turno',
      active: true,
      visible: true
    },
    {
      name: 'Eventos',
      icon: 'calendar-alt',
      to: '/eventos',
      active: true,
      visible: 'eventosLength'
    }
  ]
};

export default [appRoutes];
