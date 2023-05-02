import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const solicitudUserSistFidelitas: TipoTramite = {
  titulo: 'Solicitud de Usuario para Sistema Fidelitas',
  id: tramites.solicitudUserSistFidelitas,
  plazo: 180,
  areaId: areas.matriculacion,
  tipo: 'tramite',
  puedeIniciar: 'usuario',
  requiere: 'actividadComercial',
  descripcion: `Puedes iniciar este trámite si necesitas un usuario y clave para el Sistema Fidelitas.`,
  pasos: [
    {
      id: 0,
      variant: 'success',
      title:
        'Bienvenido/a al trámite Solicitud de Usuarios para Sistema Fidelitas',
      description: `Se te asignará un empleado del Área Matriculación para gestionar tu solicitud. 
      <br/> Si tenes alguna duda, podes enviar un mail a
      info@colegioinmobiliario.org.ar o llamar al 4124-6060`,
      actions: [
        actions.canCancel(),
        actions.manualAssingEmployee(),
        actions.cantAddDataUser()
      ],
      nextConditions: [nextConditions.asignedEmployee()],
      intraTitle:
        'Inicio del trámite, Se debe asignar un empleado del Área Matriculación para gestionar el trámite iniciado.'
    },
    {
      id: 1,
      variant: 'info',
      title: 'Carga de Usuario y Clave',
      description: `Se envia Usuario y Clave para el Sistema Fidelitas.`,
      nextConditions: [nextConditions.allInputsApproved()],
      actions: [
        actions.startPlazo(5, areas.matriculacion),
        actions.cantAddDataUser(),
        actions.canAddDataEmployee(areas.matriculacion),
        actions.canAddInformes(areas.matriculacion)
      ],
      intraTitle: 'Cargo de Usuario y Clave Sistema Fidelitas',
      intraDescription: `Se asigna Usuario y Clave para el Sistema Fidelitas.`
    },
    {
      id: 2,
      variant: 'info',
      title: 'Trámite Finalizado',
      description: `Te hemos dejado el usuario y la clave del Sistema Fidelitas en la seccion "Usuario y Clave Fidelitas".`,
      actions: [
        actions.cantAddDataUser(),
        actions.notify('user', 'sistemaFidelita'),
        actions.approveTramite(),
        actions.hideInputs('employee')
      ],
      intraTitle: 'Finalizacion del Trámite',
      intraDescription: `Se aprueba el Trámite y se envia "Usuario y Clave Fidelitas"`
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Usuario y Clave Fidelitas',
      inputs: [
        {
          nombre: 'usuarioFidelitas',
          requerido: [true]
        },
        {
          nombre: 'claveFidelitas',
          requerido: [true]
        }
      ]
    }
  ]
};

export default solicitudUserSistFidelitas;
