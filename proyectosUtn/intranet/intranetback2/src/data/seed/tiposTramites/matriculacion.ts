import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { goto } from '../actions/goto';
import { nextConditions } from '../actions/nextConditions';
import { onReject } from '../actions/onReject';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const matriculacion: TipoTramite = {
  titulo: 'Alta de Matriculación',
  id: tramites.altaMatriculacion,
  plazo: 180,
  areaId: areas.matriculacion,
  tipo: 'tramite',
  puedeIniciar: 'usuario',
  requiere: 'noMatricula',
  descripcion: `El alta de matriculación es un trámite que se realiza para obtener la matrícula profesional`,
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Bienvenido/a al trámite de alta de matriculación',
      description: `Tu primer paso es completar los formularios y subir los documentos en
        la sección <strong>Documentación</strong>, una vez completado toda la
        información requerida ( #asterisco# ),
        debes dirigirte a la sección <strong>Pago</strong> y abonar los gastos
        administrativos, para que se te asigne un empleado del Área de Matriculación para que revise
        tu documentación. <br/> Si tenes alguna duda, podes enviar un mail a
        info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      nextConditions: [nextConditions.allRequiredFilled()],
      actions: [actions.canCancel()],
      intraTitle: 'Inicio del trámite'
    },
    {
      id: 1,
      variant: 'info',
      title: 'Pago de Gastos Administrativos',
      description: `Para poder continuar con el trámite, debes abonar los gastos
        administrativos. <br/> Una vez abonado, el trámite sera asignado a un
        matriculador para que revise tu documentación.
        Podes abonar por deposito o transferencia bancaria a la cuenta de CUCICBA.`,
      nextConditions: [
        nextConditions.sentTransaction([{ nombre: 'matriculacion1' }])
      ],
      actions: [
        actions.createTransaction([{ nombre: 'matriculacion1' }]),
        actions.canCancel()
      ],
      intraTitle: 'Pago de Gastos Administrativos por parte del aspirante',
      intraDescription: `El aspirante debe subir el comprobante de pago de los gastos administrativos, el cual deberá ser aprobado por el Área de Finanzas.`
    },
    {
      id: 2,
      variant: 'success',
      title: 'Pago de Gastos Administrativos',
      description: `Personal del Área de Finanzas se encuentra revisando tu pago. Recibiras un mail cuando tu pago haya sido aprobado.`,
      prevConditions: [prevConditions.someTransactionRequest()],
      nextConditions: [
        nextConditions.transactionApproved([{ nombre: 'matriculacion1' }])
      ],
      actions: [
        actions.startPlazo(5, areas.finanzas),
        actions.startPlazo(1, areas.matriculacion),
        actions.canCancel()
      ],
      intraTitle:
        'Control y aprobación de la transacción por parte del Área de Finanzas',
      intraDescription: `El Área de Finanzas debe aprobar la transacción realizada por el aspirante.<br/>
      Una vez aprobada la transacción, el trámite deberá ser asignado a un empleado del Área de Matriculación para que revise la documentación.`
    },
    {
      id: 3,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Tu transacción fue aprobada. Ahora tu documentación esta siendo revisada por un empleado del Área de Matriculación. <br/>
        Una vez que el responsable haya revisado tu documentación, se te
        notificará por mail y podras continuar con el trámite.`,
      nextConditions: [
        nextConditions.allInputsSent(),
        nextConditions.asignedEmployee()
      ],
      actions: [
        actions.manualAssingEmployee(),
        actions.notifyMail('approvedTransaction')
      ],
      intraTitle:
        'Revisión de documentación por parte de un empleado del Área de Matriculación',
      intraDescription:
        'El aspirante debe modificar la información requerida y subir los documentos faltantes.'
    },
    {
      id: 4,
      variant: 'success',
      title: 'Revisión de documentación',
      description: `Tu documentación esta siendo revisada por un empleado del Área de Matriculación. <br/>
        Una vez que el responsable haya revisado tu documentación, se te
        notificará por mail y podras continuar con el trámite.`,
      prevConditions: [prevConditions.someInputsRequest()],
      nextConditions: [nextConditions.allInputsApproved()],
      actions: [actions.startPlazo(5, areas.matriculacion)],
      intraTitle:
        'Revisión de documentación por parte del Área de Matriculación',
      intraDescription:
        'Para continuar con el trámite, el matriculador debe aprobar la documentación.'
    },
    {
      id: 5,
      variant: 'info',
      title: 'Documentación aprobada',
      description: `Tu documentación ha sido aprobada.<br/>
      Debes solicitar un turno en la pestaña "Turno" para presentar la documentación de forma presencial en las oficinas de CUCICBA. <br/>
      Recordá que al momento de asistir debes llevar la documentación original que cargaste.`,
      actions: [
        actions.appointment(areas.matriculacion),
        actions.notifyMail('approvedData')
      ],
      nextConditions: [nextConditions.appointmentApproved()],
      intraTitle: 'Presentación de documentación en las oficinas de CUCICBA',
      intraDescription: `Aprobación o rechazo de la documentación presentada.<br/>
      En caso de ser rechazada, se deberá solicitar un nuevo turno para presentar la documentación.`
    },
    {
      id: 6,
      variant: 'success',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.matriculacion),
        actions.canAddInformes(areas.matriculacion),
        actions.canGoNextStep(areas.matriculacion),
        actions.notifyMail('approvedTurno'),
        actions.startPlazo(5, areas.matriculacion),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      intraTitle: 'Solicitud de informes externos',
      intraDescription:
        'El matriculador debe hacer la solicitud de informes externos y añadirlos al trámite.'
    },
    {
      id: 7,
      variant: 'success',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.fiscalizacion),
        actions.sendTo(areas.finanzas),
        actions.canAddInformes(areas.fiscalizacion),
        actions.canAddInformes(areas.finanzas),
        actions.canGoPrevStep(areas.fiscalizacion),
        actions.canGoPrevStep(areas.finanzas),
        actions.startPlazo(5, areas.fiscalizacion),
        actions.startPlazo(5, areas.finanzas),
        actions.startExpiration('tipo'),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.tipoSeccion('infraccion'),
        actions.canAddDataEmployee(areas.fiscalizacion),
        actions.cantAddDataUser()
      ],
      onRejectActions: [onReject.goTo(18)],
      nextConditions: [nextConditions.allAreasApproved()],
      intraTitle: 'Fiscalización y Finanzas',
      intraDescription: `Fiscalización y Finanzas revisan la información para chequear que este todo correcto. <br/>
        <strong>En el caso que el Área de Fiscalizción constatara infracciones del aspirante, podrá generar el cobro de aranceles, los cuales se pueden ver en la sección "Infracción/es" de la pestaña "Información".</strong>`
    },
    {
      id: 8,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        /* `sendTo/${areas.tesorero}`,
        `canAddInformes/${areas.tesorero}`,
        'approveOrReject',
        `startPlazo/5_${areas.tesorero}`,
        `canGoPrevStep/${areas.tesorero}`,
        `cantAddDataUser` */
        actions.sendTo(areas.tesorero),
        actions.canAddInformes(areas.tesorero),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.tesorero),
        actions.canGoPrevStep(areas.tesorero),
        actions.cantAddDataUser()
      ],
      onRejectActions: [onReject.goTo(18)],
      nextConditions: [nextConditions.allAreasApproved()],
      intraTitle: 'Tesorero',
      intraDescription:
        'El Tesorero revisa la información para chequear que este todo correcto.'
    },
    {
      id: 9,
      variant: 'success',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.secretario),
        actions.canAddInformes(areas.secretario),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.secretario),
        actions.canGoPrevStep(areas.secretario),
        actions.cantAddDataUser()
      ],
      onRejectActions: [onReject.goTo(18)],
      nextConditions: [nextConditions.allAreasApproved()],
      intraTitle: 'Secretario',
      intraDescription:
        'El Secretario revisa la información para chequear que este todo correcto.'
    },
    {
      id: 10,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.presidente),
        actions.canAddInformes(areas.presidente),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.presidente),
        actions.canGoPrevStep(areas.presidente),
        actions.cantAddDataUser()
      ],
      onRejectActions: [onReject.goTo(18)],
      nextConditions: [nextConditions.allAreasApproved()],
      intraTitle: 'Presidente',
      intraDescription:
        'El Presidente revisa la información para chequear que este todo correcto.'
    },
    {
      id: 11,
      variant: 'info',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.comisionMatriculacion),
        actions.canAddInformes(areas.comisionMatriculacion),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.comisionMatriculacion),
        actions.canGoPrevStep(areas.comisionMatriculacion),
        actions.cantAddDataUser()
      ],
      onRejectActions: [onReject.goTo(18)],
      nextConditions: [nextConditions.allAreasApproved()],
      intraTitle: 'Comisión de Matriculación',
      intraDescription:
        'La comisión de matriculación revisa la información para chequear que este todo correcto.'
    },
    {
      id: 12,
      variant: 'success',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.sendTo(areas.consejoDirectivo),
        actions.canAddResolucion(areas.consejoDirectivo),
        actions.approveOrReject('Aprobar', 'Rechazar'),
        actions.startPlazo(5, areas.consejoDirectivo),
        actions.canGoPrevStep(areas.consejoDirectivo),
        actions.cantAddDataUser()
      ],
      onRejectActions: [onReject.goTo(18)],
      nextConditions: [nextConditions.allAreasApproved()],
      intraTitle: 'Honorable Consejo Directivo',
      intraDescription:
        'El Honorable Consejo Directivo revisa la información para chequear que este todo correcto.'
    },
    {
      id: 13,
      variant: 'success',
      title: 'Debes abonar los gastos de matriculación',
      description: `Para poder continuar con el trámite, debes abonar los conceptos de "Inscripción, Matrícula Anual, Fianza Fiduciaria " y "Multa" en caso que la tengas. <br/>
      Podes acercarte a las oficinas de CUCICBA y pagar en efectivo o enviar una transferencia bancaria a...`,
      actions: [
        actions.sendTo(areas.matriculacion),
        actions.notify('user', 'ApprovedProcedure'),
        actions.notifyMail('approvedProcedure'),
        actions.createTransaction([
          { nombre: 'matriculacion2' },
          {
            nombre: 'infraccionAntesDeMatricularse1',
            condicion: 'input:infraccionAntesDeMatricularse'
          }
        ]),
        actions.canGoPrevStep(areas.matriculacion),
        actions.cantAddDataUser()
      ],
      nextConditions: [
        nextConditions.sentTransaction([
          { nombre: 'matriculacion2' },
          {
            nombre: 'infraccionAntesDeMatricularse1',
            condicion: 'input:infraccionAntesDeMatricularse'
          }
        ])
      ],
      intraTitle: 'Pago de gastos de Matriculación',
      intraDescription:
        'El aspirante debe abonar los gastos de matriculación y subir el/los comprobante/s, los cuales serán verificados por el Área de Finanzas.'
    },
    {
      id: 14,
      variant: 'info',
      title: 'Pago de  Gastos de Matriculación',
      description: `Personal del Área de Finanzas debe aprobar los pagos de matriculación. Una vez aprobado, se te notificará por mail y podrás continuar con el trámite.`,
      prevConditions: [prevConditions.someTransactionRequest()],
      nextConditions: [
        nextConditions.transactionApproved([
          { nombre: 'matriculacion2' },
          {
            nombre: 'infraccionAntesDeMatricularse1',
            condicion: 'input:infraccionAntesDeMatricularse'
          }
        ])
      ],
      actions: [
        actions.startPlazo(5, areas.finanzas),
        actions.notifyMail('approvedTransaction'),
        actions.cantAddDataUser()
      ],
      intraTitle: 'Pago de Gastos de Matriculación',
      intraDescription: 'Finanzas debe aprobar los pagos de matriculación.'
    },
    {
      id: 15,
      variant: 'success',
      title: 'Invitación a participar del Evento de Jura.',
      description:
        'Ya te encuentras en condiciones de ser participe del Evento de Jura, podrás confirmar tu asistencia o esperar al proximo evento desde el panel de eventos.',
      actions: [actions.event('Jura'), actions.cantAddDataUser()],
      nextConditions: [nextConditions.eventConfirm('Jura')],
      intraTitle: 'Invitación al Evento de Jura',
      intraDescription: `Todos los aspirantes que se encuentren en condiciones de ser invitado al Evento de Jura, los podrás seleccionar
      desde el panel de eventos.
      `
    },
    {
      id: 16,
      variant: 'info',
      title: '',
      description:
        'El Área de Matriculación se encuentra en proceso de revisión si asististe al evento de Jura.',
      actions: [
        actions.sendTo(areas.matriculacion),
        actions.assingMatricula(),
        actions.startPlazo(5, areas.matriculacion),
        actions.canAddDataEmployee(areas.matriculacion),
        actions.cantAddDataUser(),
        actions.tipoSeccion('matricula'),
        actions.notify('admin', 'registroMatricula')
      ],
      goto: [goto.allInputsApproved(17)],
      intraTitle: 'Asiento de Matrícula',
      intraDescription:
        'Debes realizar el asiento de la Matrícula en los Libros, Tomo y Folio.'
    },
    {
      id: 17,
      variant: 'success',
      title: 'Evento de Jura',
      description: '',
      actions: [
        actions.cantAddDataUser(),
        actions.canGoPrevStep(areas.matriculacion)
      ],
      prevConditions: [prevConditions.eventRejected('Jura')],
      goto: [goto.eventApproved('Jura', 20)],
      intraTitle:
        'Confirmación o Reprogramación de los aspirantes que asistieron al Evento de Jura',
      intraDescription:
        'Para confirmar o reprogramar la asistencia del/los aspirante/s al Evento de Jura, lo puedes hacer desde el panel de eventos.'
    },

    {
      id: 18,
      variant: 'danger',
      title: 'Documentación Rechazada.',
      description: `Tu documentación ha sido rechazada y se da por finalizado el trámite.`,
      actions: [
        actions.sendTo(areas.legales),
        actions.canGoNextStep(areas.legales, ['hasDictamen']),
        actions.canAddDictamen(areas.legales),
        actions.startPlazo(5, areas.legales),
        actions.cantAddDataUser()
      ],
      intraTitle: 'Área de Legales',
      intraDescription:
        'Se debe generar un Dictamen por el rechazo de la documentación.'
    },
    {
      id: 19,
      variant: 'danger',
      title: 'Documentación Rechazada.',
      description: `Tu documentación ha sido rechazada y se da por finalizado el trámite.`,
      actions: [
        actions.changeStatus(EstadoTramite.rechazado),
        actions.cantAddDataUser()
      ],
      intraTitle: 'Área de Legales',
      intraDescription: ''
    },
    {
      id: 20,
      variant: 'success',
      title: 'Matrícula aprobada',
      description: `Tu matrícula ha sido aprobada.<br/>
      Tu número de matrícula es: #nroMatricula#.<br/>
      Recordá que para poder ejercer la profesión debes realizar la Declaración Jurada de Actividad Comercial.`,
      actions: [
        actions.finishExpiration(),
        actions.activateMatriculaSinActividad(),
        actions.vencimientoMatricula(),
        actions.approveTramite(),
        actions.cantAddDataUser()
      ],
      intraTitle: 'Matrícula Aprobada'
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Información Personal',
      inputs: [
        {
          nombre: 'nombre',
          requerido: [true]
        },
        {
          nombre: 'apellido',
          requerido: [true]
        },
        {
          nombre: 'apellidoMaterno',
          requerido: [false]
        },
        {
          nombre: 'fechaNacimiento',
          requerido: [true]
        },
        {
          nombre: 'lugarNacimiento',
          requerido: [true]
        },
        {
          nombre: 'nacionalidad',
          requerido: [true]
        },
        {
          nombre: 'dni',
          requerido: [true]
        },
        {
          nombre: 'cuitCuil',
          requerido: [false]
        },
        {
          nombre: 'sexo',
          requerido: [true]
        },
        {
          nombre: 'estadoCivil',
          requerido: [true]
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Informacion de Contacto',
      inputs: [
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
          nombre: 'celularParticular',
          requerido: [true]
        },
        {
          nombre: 'telefonoParticular',
          requerido: [true]
        },
        {
          nombre: 'mailParticular',
          requerido: [true]
        },
        {
          nombre: 'mailAlterrnativo',
          requerido: [false]
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Documentación Personal',
      inputs: [
        {
          nombre: 'fotoCarnet',
          requerido: [true]
        },
        {
          nombre: 'frenteDNI',
          requerido: [true]
        },
        {
          nombre: 'dorsoDNI',
          requerido: [true]
        },
        {
          nombre: 'escaneoFirma',
          requerido: [true]
        },
        {
          nombre: 'acreditacionDomicilioCABA',
          requerido: [true],
          multiple: true
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Documentación Academica',
      inputs: [
        {
          nombre: 'nombreUniversidad',
          requerido: [true]
        },
        {
          nombre: 'localidadUniversidad',
          requerido: [true]
        },
        {
          nombre: 'fechaInicioCarrera',
          requerido: [true]
        },
        {
          nombre: 'fechaFinCarrera',
          requerido: [true]
        },
        {
          nombre: 'carreraUniversidad',
          requerido: [true]
        },
        {
          nombre: 'tituloUniversitario',
          requerido: [true]
        },
        {
          nombre: 'certificadoAnalitico',
          requerido: [true]
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Otros Documentos',
      inputs: [
        {
          nombre: 'certficadoEstadisticasReincidenciasCriminales',
          requerido: [true]
        },
        {
          nombre: 'certificadoJuiciosUniversales',
          requerido: [true]
        }
        // {
        //   nombre: 'logo',
        //   requerido: [false]
        // }
      ]
    },
    // {
    //   id: getS(),
    //   titulo: 'Invitados al Evento de Juramento',
    //   tipo: 'invitadosAspirante',
    //   inputs: [
    //     {
    //       nombre: 'checkInvitado',
    //       requerido: [false]
    //     },
    //     {
    //       nombre: 'nombreInvitado1',
    //       requerido: [false],
    //       padre: 'checkInvitado'
    //     },
    //     {
    //       nombre: 'apellidoInvitado1',
    //       requerido: [false],
    //       padre: 'checkInvitado'
    //     },
    //     {
    //       nombre: 'dniInvitado1',
    //       requerido: [false],
    //       padre: 'checkInvitado'
    //     },
    //     {
    //       nombre: 'nombreInvitado2',
    //       requerido: [false],
    //       padre: 'checkInvitado'
    //     },
    //     {
    //       nombre: 'apellidoInvitado2',
    //       requerido: [false],
    //       padre: 'checkInvitado'
    //     },
    //     {
    //       nombre: 'dniInvitado2',
    //       requerido: [false],
    //       padre: 'checkInvitado'
    //     }
    //   ]
    // },
    {
      id: getS(),
      titulo: 'Asiento Matrícula en Libro, Tomo, y Folio',
      tipo: 'matricula',
      inputs: [
        {
          nombre: 'libroMatricula',
          requerido: [true]
        },
        {
          nombre: 'tomoMatricula',
          requerido: [true]
        },
        {
          nombre: 'folioMatricula',
          requerido: [true]
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Infracción/nes',
      tipo: 'infraccion',
      inputs: [
        {
          nombre: 'infraccionAntesDeMatricularse',
          requerido: [false]
        },
        {
          nombre: 'arancelesFiscalizacion',
          requerido: [false, 'infraccionAntesDeMatricularse'],
          padre: 'infraccionAntesDeMatricularse'
        },
        {
          nombre: 'infraccionAntesDeMatricularseMonto',
          requerido: [false, 'infraccionAntesDeMatricularse'],
          padre: 'infraccionAntesDeMatricularse'
        }
      ]
    }
  ]
};

export default matriculacion;
