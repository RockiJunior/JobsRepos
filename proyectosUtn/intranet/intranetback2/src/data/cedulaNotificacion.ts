import areas from './areas';

export const cedulaNotificacion = {
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Creacion de la Cedula',
      description: `Se crea la cedula de Nofiicacion par el Matriculado`,
      intraTitle: 'Creacion de la Cedula',
      nextConditions: ['asignedEmployee'],
      action: [`startPlazo/5_${areas.inspeccion}`]
    },
    {
      id: 1,
      variant: 'info',
      title: 'Cedula de Notificacion',
      description: `Se realizara la verificacion si posee domicilio electronico o fisico`,
      actions: [
        `canGoNextStep/${areas.inspeccion}`,
        `startPlazo/5_${areas.inspeccion}`,
        `canAddInformes/${areas.inspeccion}`,
        `dateReception`
      ],

      intraTitle: 'Revisión de Direccion'
    },
    {
      id: 2,
      variant: 'info',
      title: 'Cedula de Notificacion',
      description: `Se envia a Fiscalizacion`,
      actions: [`sendTo/${areas.fiscalizacion}`],
      intraTitle: 'Fiscalizacion'
    }
  ]
};
