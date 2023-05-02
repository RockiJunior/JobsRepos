import { EstadoTramite } from '@prisma/client';
import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const denunciaPorCucicba: TipoTramite = {
  id: tramites.denunciaPorCucicba,
  titulo: 'Denuncia de Oficio (Legales)',
  areaId: areas.legales,
  plazo: 180,
  tipo: 'denuncia',
  puedeIniciar: 'empleado',
  requiere: 'oculto',
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Sistema de Denuncias',
      description: ``,
      intraTitle: 'Inicio del Trámite Área Legales',
      actions: [
        actions.canCancel(),
        actions.sendTo(areas.legales),
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.legales),
        actions.canAddArchivos(areas.legales),
        actions.canAddInformes(areas.legales),
        actions.canGoNextStep(areas.legales, ['allRequiredFilled']),
        actions.startPlazo(5, areas.legales)
      ],
      intraDescription:
        'Debes completar los Formularios con los datos requeridos, puedes incorporar de ser necesario, archivos e informes.'
    },
    {
      id: 1,
      variant: 'success',
      title: 'Sistema de Denuncias',
      description: ``,
      intraTitle: 'Trámite Finalizado',
      intraDescription: `El Trámite ha finalizado.`,
      actions: [
        actions.startExpediente(),
        actions.changeStatus(EstadoTramite.aprobado)
      ]
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
      titulo: 'Matrícula del denunciado',
      tipo: 'esMatriculado',
      inputs: [
        {
          nombre: 'numeroMatricula',
          requerido: [true]
        },
        {
          nombre: 'libroMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula'
        },
        {
          nombre: 'tomoMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula'
        },
        {
          nombre: 'folioMatricula',
          requerido: [false, 'numeroMatricula'],
          padre: 'numeroMatricula'
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Motivo de la Denuncia',
      inputs: [
        {
          nombre: 'motivoDenuncia',
          requerido: [true]
        },
        {
          nombre: 'archivoDenuncia',
          requerido: [false],
          multiple: true
        }
      ]
    }
  ]
};

export default denunciaPorCucicba;
