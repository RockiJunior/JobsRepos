import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';
import { onReject } from '../actions/onReject';

const denunciaExterna: TipoTramite = {
  id: tramites.denunciaExterna,
  titulo: 'Denuncia Externa',
  areaId: areas.fiscalizacion,
  plazo: 180,
  tipo: 'denuncia',
  puedeIniciar: 'externo',
  requiere: 'oculto',
  descripcion: `El sistema de denuncias es un canal de comunicación entre el público en general y CUCICBA, a través del cual se pueden realizar denuncias de irregularidades en la actividad inmobiliaria, que afecten a los asociados o a la institución.
  <br/>
  Las denuncias pueden realizarse habiendo o no identificado al denunciado. 
  <br/>
  CUCICBA se reserva el derecho de no dar respuesta a las denuncias que no cumplan con los requisitos establecidos en el presente sistema.`,

  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Revisión de documentación',
      description: `Se te asignara un empleado de CUCICBA del Área correspondiente.<br/>
        Una vez que el mismo haya revisado tu presentación, se te
        notificara y podras continuar con el trámite.`,
      nextConditions: [nextConditions.asignedEmployee()],
      actions: [actions.manualAssingEmployee()],
      intraTitle: 'Asignación de empleado',
      intraDescription: `Debes asignar un empleado del Área para gestionar el trámite iniciado.`
    },
    {
      id: 1,
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
      id: 2,
      variant: 'warning',
      title: 'Sistema de Denuncias',
      description: `El Sistema se encuentra verificando si estas adherida/o a la recepción de céluda electrónica.`,
      actions: [actions.canGoNextStep(areas.fiscalizacion)],
      intraTitle: 'Verificación adhesión Cédula Electrónica',
      intraDescription: `Debes verificar que la/el denunciante este adherida/o a la recepción de céluda electrónica.`
    },
    {
      id: 3,
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
          nombre: 'mailDenunciado',
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
          requerido: [true]
        },
        {
          nombre: 'apellido',
          requerido: [true]
        },
        {
          nombre: 'dni',
          requerido: [true]
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
          nombre: 'domicilioReal',
          requerido: [true]
        },
        {
          nombre: 'codigoPostalReal',
          requerido: [true]
        }
        /*,{
          nombre: 'ciudadSolicitante',
          requerido: [true]
        },
        {
          nombre: 'provinciaSolicitante',
          requerido: [true]
        },
        {
          nombre: 'paisSolicitante',
          requerido: [true]
        }*/
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

export default denunciaExterna;
