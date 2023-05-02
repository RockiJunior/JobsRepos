export const appRoutes = {
  label: 'app',
  labelDisable: true,
  children: [
    {
      name: 'Ir al inicio',
      icon: 'home',
      to: '/',
      active: true
    },
    {
      name: 'Consultas y reclamos',
      icon: 'comments',
      to: '/consultas-y-reclamos',
      active: true
    },
    {
      name: 'Bloquear avisos',
      icon: 'ban',
      to: '/bloquear-avisos',
      active: true
    },
    {
      name: 'Gestionar estadísticas',
      icon: 'chart-pie',
      to: '/manageStats',
      active: true
    },
    {
      name: 'Gestionar usuarios Cucicba',
      icon: 'building-user',
      to: '/gestionar-usuarios-cucicba',
      active: true
    },
    {
      name: 'Gestionar usuarios inmobiliarios',
      icon: 'users',
      to: '/gestionar-usuarios-inmobiliarios',
      active: true
    },
    {
      name: 'Gestionar guía de barrios',
      icon: 'map-location-dot',
      to: '/gestionar-guia-de-barrios',
      active: true
    },
    {
      name: 'Gestionar noticias',
      icon: 'newspaper',
      to: '/gestionar-noticias',
      active: true
    }
  ]
};

export default [appRoutes];
