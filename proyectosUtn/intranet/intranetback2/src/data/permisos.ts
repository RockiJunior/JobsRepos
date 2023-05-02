const generateGetId = () => {
  let id = 1;
  return () => id++;
};

const getId = generateGetId();

const permisos = {
  tramites: {
    ver_tramites_area: getId(), // Hecho
    ver_tramites_todos: getId(), // Hecho
    crear_tramite: getId() // Hecho
  },
  expedientes: {
    ver_expedientes_area: getId(), // Hecho
    ver_expedientes_todos: getId(), // Hecho
    crear_expediente: getId() // Hecho
  },
  cedulas: {
    ver_cedulas_area: getId(), // Hecho
    ver_cedulas_todas: getId() // Hecho
  },
  area: {
    asignar_empleados: getId(), // Hecho
    modificar_disponibilidad: getId(), // Hecho
    ver_disponibilidad: getId() // Hecho
  },
  turnos: {
    ver_turnos_reservados_area: getId(), // Hecho
    ver_turnos_todos: getId() // Hecho
  },
  notificaciones: {
    notificacion_plazos_vencidos: getId() // Revisar
  },
  eventos: {
    ver_eventos: getId(), // Hecho
    crear_eventos: getId(), // Hecho
    modificar_eventos: getId(), // Hecho
    eliminar_eventos: getId(), // Hecho
    ver_lista_espera: getId() // Hecho
  },
  empleados: {
    ver_empleados: getId(), // Hecho
    crear_empleados: getId(), // Hecho
    modificar_empleados: getId(), // Hecho
    eliminar_empleados: getId() // Hecho
  },
  roles: {
    ver_roles: getId(), // Hecho,
    crear_roles: getId(), // Hecho
    modificar_roles: getId(), // Hecho
    eliminar_roles: getId() // Hecho
  },
  usuarios: {
    ver_usuarios: getId() // Hecho
  },
  transacciones: {
    ver_transacciones: getId(), // Hecho
    ver_transacciones_todas: getId() // Hecho
  }
};

export default permisos;
