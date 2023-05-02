import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';
import { onReject } from '../actions/onReject';

const denunciaMatriculaAOtroMatriculado: TipoTramite = {
  id: tramites.denunciaMatriculaAOtroMatriculado,
  titulo: 'Denuncia de Matriculado a Otro Matriculado',
  areaId: areas.fiscalizacion,
  plazo: 180,
  tipo: 'denuncia',
  puedeIniciar: 'usuario',
  requiere: 'matricula',

  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Bienvenido/a al Sistema de Denuncias de CUCICBA',
      description: `Tu primer paso es completar los formularios, una vez completado toda la
        información requerida ( #asterisco# ), se te asignará un empleado del Área correspondiente para que revise
        tu presentación. <br/> Si tenes alguna duda, podes enviar un mail a
        info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      nextConditions: [nextConditions.allRequiredFilled()],
      actions: [actions.canCancel()],
      intraTitle: 'Inicio del trámite',
      intraDescription: `Inicio del trámite, el Matriculado debe completar los formularios.`
    },
    {
      id: 1,
      variant: 'info',
      title: 'Revisión de documentación',
      description: `Se te asignará un empleado de CUCICBA del área correspondiente.<br/>
        Una vez que el mismo haya revisado tu presentación, se te
        notificará y podras continuar con el trámite.`,
      nextConditions: [nextConditions.asignedEmployee()],
      actions: [actions.manualAssingEmployee()],
      intraTitle: 'Asignación de empleado Área Fiscalización',
      intraDescription: `Debes asignar un empleado del Área para gestionar el trámite iniciado.`
    },
    {
      id: 2,
      variant: 'info',
      title: 'Personal de CUCICBA se encuentra verificando lo denunciado',
      description: ``,
      actions: [
        actions.sendTo(areas.fiscalizacion),
        actions.approveOrReject('Dar curso', 'Desestimar'),
        actions.approveAllInputs()
      ],
      nextConditions: [nextConditions.allAreasApproved()],
      onRejectActions: [onReject.changeStatus(EstadoTramite.rechazado)],
      intraTitle: 'Debes dar curso a desestimar',
      intraDescription: `Debes dar curso a la denuncia o desestimarla.`
    },
    {
      id: 3,
      variant: 'warning',
      title: 'Sistema de Denuncias',
      description: `El Sistema se encuentra en revisión si estás adeherido/a a la Cédula Electronica.`,
      actions: [actions.canGoNextStep(areas.fiscalizacion)],
      intraTitle: 'Verificación de Cédula Electrónica',
      intraDescription:
        'Para continuar con este Trámite el Usuario debe estar adherido a la Cédula Electrónica.'
    },
    {
      id: 4,
      variant: 'info',
      title: 'Sistema de Denuncias',
      description: `Se procede a generar un Expediente con la denuncia realizada.`,
      actions: [
        actions.startExpediente(),
        actions.changeStatus(EstadoTramite.aprobado),
        actions.notifyMail('approveTramite')
      ],
      intraTitle: 'Trámite finalizado',
      intraDescription: 'El Trámite ha finalizado.'
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Datos del denunciado',
      inputs: [
        {
          nombre: 'matriculadoDenunciado',
          requerido: [false]
        },
        {
          nombre: 'checkNoMatriculado',
          requerido: [false]
        },
        {
          nombre: 'nombreDenunciado',
          requerido: [false, 'checkNoMatriculado'],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'apellidoDenunciado',
          requerido: [false, 'checkNoMatriculado'],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'firmaInmobiliaria',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'dniDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'telefonoDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'domicilioDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        },
        {
          nombre: 'numeroMatriculaDenunciado',
          requerido: [false],
          padre: 'checkNoMatriculado'
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Datos del denunciante',
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
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'telefonoParticular',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'domicilioReal',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'codigoPostalLegal',
          requerido: [true],
          isDisabled: true,
          padre: 'domicilioLegal'
        },
        {
          nombre: 'numeroMatricula',
          requerido: [true],
          isDisabled: true
        },
        {
          nombre: 'libroMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: true,
          padre: 'numeroMatricula'
        },
        {
          nombre: 'tomoMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: true,
          padre: 'numeroMatricula'
        },
        {
          nombre: 'folioMatricula',
          requerido: [false, 'numeroMatricula'],
          isDisabled: true,
          padre: 'numeroMatricula'
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Motivos de la Denuncia',
      inputs: [
        {
          nombre: 'motivoDenuncia',
          requerido: [true]
        },
        {
          nombre: 'archivoDenuncia',
          requerido: [false],
          multiple: true
        },
        {
          nombre: 'cedulaElectronica',
          requerido: [true]
        }
      ]
    }
  ]
};

export default denunciaMatriculaAOtroMatriculado;
