import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { goto } from '../actions/goto';
import { nextConditions } from '../actions/nextConditions';
import { onExpiration } from '../actions/onExpiration';
import { onReject } from '../actions/onReject';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const ddjjActividadComercial: TipoTramite = {
  id: tramites.ddjjActividadComercial,
  titulo: 'Declaración Jurada de Actividad Comercial',
  areaId: areas.matriculacion,
  plazo: 180,
  tipo: 'declaracion_jurada',
  puedeIniciar: 'usuario',
  requiere: 'matricula',
  descripcion: `La Declaración Jurada de Actividad Comercial es 
  obligatoria para todos los matriculados que realicen actividad comercial.
  Es necesaria para acceder a tu oblea y poder realizar operaciones inmobiliarias.
  `,
  pasos: [
    // {
    //   id: 0,
    //   variant: 'success',
    //   title: 'Inicio de la declaración jurada de actividad comercial',
    //   description: `Tu primer paso es elegir si realizas actividad`,
    //   intraTitle: 'Inicio del trámite',
    //   actions: ['interno/actividad', 'canCancel'],
    //   goto: ['interno/actividad_no_1', 'interno/actividad_si_2']
    // },
    // {
    //   id: 1,
    //   variant: 'info',
    //   title: 'Declaración jurada de no actividad comercial',
    //   description: `Debes llenar la declaración jurada de no actividad comercial`,
    //   intraTitle: 'Declaración jurada de no actividad comercial',
    //   actions: ['tipoSeccion/noActividad', 'canCancel'],
    //   goto: ['allRequiredFilled/3']
    // },
    {
      id: 0,
      variant: 'info',
      title: 'Declaración Jurada de Actividad Comercial',
      description: `Tu primer paso es completar el formulario, una vez completado toda la
      información requerida ( #asterisco# ), se te asignará un empleado del Área Matriculación para que revise
      tu documentación. <br/> Si tenes alguna duda, podes enviar un mail a
      info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      intraTitle: 'Declaración Jurada de Actividad Comercial',
      actions: [actions.tipoSeccion('actividadComercial'), actions.canCancel()],
      nextConditions: [nextConditions.allRequiredFilled()],
      intraDescription: `Inicio del trámite, el Matriculado debe completar el formulario.`
    },
    {
      id: 1,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo revisada por personal del Área Matriculación. <br/>
        Una vez que el mismo haya revisado, se te notificará y podras continuar con el trámite.`,
      nextConditions: [
        nextConditions.allInputsSent(),
        nextConditions.asignedEmployee()
      ],
      actions: [actions.manualAssingEmployee(), actions.canCancel()],
      intraTitle: 'Revisión de documentación por Área Matriculación',
      intraDescription: `Se debe asignar un empleado del Área Matriculación para gestionar el trámite iniciado.`
    },
    {
      id: 2,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo revisada por el Área Matriculación. <br/>
        Una vez que el mismo haya revisado, se te notificará y podras continuar con el trámite.`,
      prevConditions: [prevConditions.someInputsRequest()],
      nextConditions: [nextConditions.allInputsApproved()],
      actions: [actions.startPlazo(5, areas.matriculacion)],
      intraTitle: 'Revisión de documentación por Área Matriculación',
      intraDescription: `Revisión de los datos ingresados por el Matriculado.`
    },
    {
      id: 3,
      variant: 'success',
      title: 'Documentación aprobada',
      description: `Tu documentación ha sido aprobada.<br/>
      Debes solicitar un turno en la pestaña "Turno" para presentar la documentación
      de forma presencial en las oficinas de CUCICBA.`,
      actions: [
        actions.appointment(areas.matriculacion),
        actions.firmaPdf(),
        actions.notifyMail('approvedData')
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle:
        'Solicitud de turno y presentación de documentación en las oficinas de CUCICBA.',
      intraDescription: `Aprobación o rechazo de la documentación presentada.<br/>
      El aspirante debe solicitar turno. Una vez solicitado la información del mismo aparecerá en la pestaña "Turno". `
    },
    {
      id: 4,
      variant: 'success',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas.',
      description: `Se te podrán solicitar cambios en tu documentación. <br/> Y si has solicitado Libro de Rubrica, deberás abonar el arancel correspondiente.`,
      actions: [
        actions.createTransaction([
          { nombre: 'libroRubricado', condicion: 'input:libroRubricado' }
        ]),
        actions.canAddInformes(areas.matriculacion),
        actions.canOnlyApprove(areas.matriculacion, 'Enviar a fiscalización'),
        actions.startPlazo(5, areas.matriculacion),
        actions.sendTo(areas.matriculacion),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      nextConditions: [
        nextConditions.allAreasApproved(),
        nextConditions.sentTransaction([
          { nombre: 'libroRubricado', condicion: 'input:libroRubricado' }
        ])
      ],
      intraTitle: 'Informes',
      intraDescription: `De ser necesario, deberas realizar un informe para la revisión de la documentación. <br/> 
      <strong>En el caso de haberse solicitado Libro de Rubrica el matriculado deberá abonar el arancel.</strong>`
    },
    {
      id: 5,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.startExpiration('tipo'),
        actions.sendTo(areas.fiscalizacion),
        actions.canAddInformes(areas.fiscalizacion),
        actions.startPlazo(5, areas.fiscalizacion),
        actions.startPlazo(5, areas.finanzas),
        actions.createPdf(),
        actions.canGoPrevStep(areas.fiscalizacion),
        actions.canGoNextStep(areas.fiscalizacion)
        //actions.canRequestChanges(areas.fiscalizacion)
      ],
      /* onRequestChanges: [onRequestChanges.goTo(3)], */
      nextConditions: [
        nextConditions.transactionApproved([
          { nombre: 'libroRubricado', condicion: 'input:libroRubricado' }
        ])
      ],
      intraTitle: 'Fiscalización',
      intraDescription: `De ser necesario, deberas realizar un informe para la revisión de la documentación. <br/> 
      Y en el caso de haberse solicitado Libro de Rubrica y abonado el arancel, el Área Finanzas debe aprobar la transacción para poder continuar con el trámite.`
    },
    {
      id: 6,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.notifyMail('approvedTransaction'),
        actions.sendTo(areas.inspeccion),
        actions.canAddInformes(areas.inspeccion),
        actions.startPlazo(5, areas.inspeccion),
        actions.canGoPrevStep(areas.inspeccion),
        actions.canGoNextStep(areas.inspeccion)
      ],
      intraTitle: 'Inspección',
      intraDescription: `De ser necesario, deberas realizar un informe para la revisión de la documentación.`
    },
    {
      id: 7,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.fiscalizacion),
        actions.canAddInformes(areas.fiscalizacion),
        actions.canAddIntimacion(areas.fiscalizacion),
        actions.startPlazo(5, areas.fiscalizacion),
        actions.canOnlyApprove(areas.fiscalizacion, 'Continuar trámite'),
        actions.canGoPrevStep(areas.fiscalizacion)
      ],
      nextConditions: [nextConditions.hasIntimacion()],
      goto: [goto.allAreasApproved(9)],
      intraTitle: 'Fiscalización Observaciones',
      intraDescription: `Aprobación o rechazo de la documentación presentada, de ser necesario deberas realizar un informe.`
    },
    {
      id: 8,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.startPlazo(5, areas.fiscalizacion),
        actions.generarCedula(areas.fiscalizacion, 'nomail'),
        actions.canGoNextStep(areas.fiscalizacion, ['hasCedula']),
        actions.canGoPrevStep(areas.fiscalizacion)
      ],
      intraTitle: 'Generar Cédula',
      intraDescription: `Debes generar una Cédula de Notificación.`
    },
    {
      id: 9,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.comisionFiscalizacion),
        actions.canAddInformes(areas.comisionFiscalizacion),
        actions.startPlazo(5, areas.comisionFiscalizacion),
        actions.canGoNextStep(areas.comisionFiscalizacion),
        actions.canGoPrevStep(areas.comisionFiscalizacion)
      ],
      intraTitle: 'Comisión de Fiscalización',
      intraDescription: `De ser necesario, deberas realizar un informe para la revisión de la documentación.`
    },
    {
      id: 10,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.consejoDirectivo),
        actions.canAddResolucion(areas.consejoDirectivo),
        actions.approveOrReject(
          'Aprobar documentación',
          'Rechazar documentación'
        ),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoPrevStep(areas.consejoDirectivo)
      ],
      goto: [goto.allAreasApproved(15)],
      onRejectActions: [onReject.goTo(11)],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription: `Aprobación o rechazo de la documentación presentada.`
    },
    {
      id: 11,
      variant: 'info',
      title: 'Tu documentación ha sido rechazada',
      description: `La documentación a sido rechazada`,
      actions: [
        actions.generarCedula(areas.consejoDirectivo, 'nomail'),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoNextStep(areas.consejoDirectivo, ['hasCedula'])
      ],
      intraTitle: 'Debes generar una Cédula de Noficiación.'
    },
    {
      id: 12,
      variant: 'danger',
      title:
        'La documentación ha sido rechazada y cuenta con 10 dias habiles para apelar',
      description: `La documentación ha sido rechazada y cuenta con 10 dias habiles para apelar`,
      actions: [
        actions.sendTo(areas.matriculacion),
        actions.startExpiration(10),
        actions.canAddArchivos(areas.matriculacion, 'Apelación'),
        actions.canGoNextStep(areas.matriculacion),
        actions.canAddInformes(areas.matriculacion)
      ],
      nextConditions: [nextConditions.allAreasApproved()],
      onExpiration: [onExpiration.startExpediente(areas.fiscalizacion)],
      intraTitle: 'Apelación',
      intraDescription: `Debes indicar si el Matriculado realizo una apelación, incorporando dicha documentación al trámite, teniendo como plazo 10 dias habiles.`
    },
    {
      id: 13,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.legales),
        actions.canAddDictamen(areas.legales),
        actions.startPlazo(5, areas.legales),
        actions.defaultTab('acciones'),
        actions.generateTab('Apelación'),
        actions.canGoPrevStep(areas.legales),
        actions.canGoNextStep(areas.legales)
      ],
      intraTitle: 'Analisís de Legales',
      intraDescription: `Se debe confeccionar un Dictamen.`
    },
    {
      id: 14,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.consejoDirectivo),
        actions.approveOrReject(
          'Aprobar Declaración Jurada',
          'Rechazar Declaración Jurada'
        ),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoPrevStep(areas.consejoDirectivo)
      ],
      nextConditions: [nextConditions.allAreasApproved()],
      onRejectActions: [
        onReject.goTo(16),
        onReject.startExpediente(areas.fiscalizacion),
        onReject.changeStatus(EstadoTramite.rechazado)
      ],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription: `Aprobación o rechazo de la documentación presentada.`
    },
    {
      id: 15,
      variant: 'success',
      title: 'Tu declaración ha sido aprobada y se ha generado tu oblea',
      description: ``,
      actions: [
        actions.approveOblea(),
        actions.approveTramite(),
        actions.setActividadComercial(true),
        actions.activateMatriculaConActividad()
      ],
      intraTitle: 'Tramite Terminado',
      intraDescription: `Se ha aprobado el trámite de Declaración Jurada de Datos Comerciales`
    },
    {
      id: 16,
      variant: 'danger',
      title: 'Tu Declaración Juarada ha sido rechazada',
      description: `La presentacion ha sido rechazada`,
      intraTitle: 'Tramite Terminado',
      intraDescription: 'Finalizo el trámite como rechazado'
    }
  ],
  secciones: [
    // {
    //   titulo: 'Datos internos',
    //   tipo: 'interno',
    //   inputs: [
    //     {
    //
    //       nombre: 'actividad',
    //       titulo: 'Realiza actividad comercial?',
    //       tipo: 'choose',
    //       opciones: [
    //         {
    //           label: 'Si realizo actividad',
    //           descripcion:
    //             '> Elije esta opción si realizas actividad comercial',
    //           value: 'si'
    //         },
    //         {
    //           label: 'No realizo actividad',
    //           descripcion:
    //             '> Elije esta opción si no realizas actividad comercial',
    //           value: 'no'
    //         }
    //       ],
    //       requerido: [true]
    //     }
    //   ]
    // },
    {
      id: getS(),
      titulo: 'Datos del matriculado',
      inputs: [
        {
          nombre: 'nombre',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'apellido',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'dni',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'mailParticular',
          requerido: [true]
        },
        {
          nombre: 'telefonoParticular',
          requerido: [true]
        },
        {
          nombre: 'celularParticular',
          requerido: [true]
        },
        {
          nombre: 'domicilioReal',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalReal',
          requerido: [true]
        },
        {
          nombre: 'domicilioLegal',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalLegal',
          requerido: [true]
        },
        {
          nombre: 'numeroMatricula',
          requerido: [true],
          isDisabled: false // true
        },
        {
          nombre: 'libroMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: false, // true
          padre: 'numeroMatricula'
        },
        {
          nombre: 'tomoMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: false, // true
          padre: 'numeroMatricula'
        },
        {
          nombre: 'folioMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: false, // true
          padre: 'numeroMatricula'
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Actividad Comercial',
      tipo: 'actividadComercial',
      inputs: [
        {
          nombre: 'cuitCuil',
          requerido: [true]
        },
        {
          nombre: 'nombreFantasia',
          requerido: [false]
        },
        {
          nombre: 'emailComercial',
          requerido: [true],
          multiple: true
        },
        {
          nombre: 'telefonoComercial',
          requerido: [true],
          multiple: true
        },
        {
          nombre: 'domicilioComercial',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalComercial',
          requerido: [true]
        },
        {
          nombre: 'domicilioCasaCentral',
          requerido: [true]
        },
        {
          nombre: 'telefonoCasaCentral',
          requerido: [true]
        },
        {
          nombre: 'sucursal1',
          requerido: [false]
        },
        {
          nombre: 'domicilioSucursal1',
          requerido: [false, 'sucursal1'],
          padre: 'sucursal1'
        },
        {
          nombre: 'telefonoSucursal1',
          requerido: [false, 'sucursal1'],
          padre: 'sucursal1'
        },
        {
          nombre: 'facturaDireccionSucursal1',
          requerido: [false, 'sucursal1'],
          padre: 'sucursal1'
        },
        {
          nombre: 'sucursal2',
          requerido: [false],
          padre: 'sucursal1'
        },
        {
          nombre: 'domicilioSucursal2',
          requerido: [false, 'sucursal2'],
          padre: 'sucursal2'
        },
        {
          nombre: 'telefonoSucursal2',
          requerido: [false, 'sucursal2'],
          padre: 'sucursal2'
        },
        {
          nombre: 'facturaDireccionSucursal2',
          requerido: [false, 'sucursal2'],
          padre: 'sucursal2'
        },
        {
          nombre: 'constanciaInscripcionAfip',
          requerido: [true]
        },
        {
          nombre: 'comprobanteIngresosBrutos',
          requerido: [true]
        },
        {
          nombre: 'facturaElectronica',
          requerido: [true]
        },
        {
          nombre: 'marcaRegistrada',
          requerido: [false]
        },
        {
          nombre: 'marcaRegistradaNombre',
          requerido: [false, 'marcaRegistrada'],
          padre: 'marcaRegistrada'
        },
        {
          nombre: 'marcaRegistradaRegistroInpi',
          requerido: [false, 'marcaRegistrada'],
          padre: 'marcaRegistrada'
        },
        {
          nombre: 'marcaRegistradaHojaBocba',
          requerido: [false],
          padre: 'marcaRegistrada'
        },
        {
          nombre: 'marcaRegistradaCesion',
          requerido: [false],
          padre: 'marcaRegistrada'
        },
        {
          nombre: 'sociedad',
          requerido: [false]
        },
        {
          nombre: 'nombreSociedad',
          requerido: [false, 'sociedad'],
          padre: 'sociedad'
        },
        {
          nombre: 'razónSocial',
          requerido: [false, 'sociedad'],
          padre: 'sociedad'
        },
        {
          nombre: 'porcentajeSociedad',
          requerido: [false, 'sociedad'],
          padre: 'sociedad'
        },
        {
          nombre: 'copiaEstatutoSociedad',
          requerido: [false, 'sociedad'],
          padre: 'sociedad'
        },
        {
          nombre: 'libroRubricado',
          requerido: [false]
        },
        {
          nombre: 'desafectacionSociedad',
          requerido: [false]
        },
        {
          nombre: 'desafectacionSociedadNombre',
          requerido: [false, 'desafectacionSociedad'],
          padre: 'desafectaciónSociedad',
          isDisabled: true
        }
      ]
    }
  ]
};

export default ddjjActividadComercial;
