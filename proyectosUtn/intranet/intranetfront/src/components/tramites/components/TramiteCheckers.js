import dayjs from 'dayjs';

export const useAppointmentStep = (tramite, user) => {
  return !!(
    (tramite.tipo?.pasos[tramite.pasoActual]?.actions?.includes(
      `appointment/${user.empleado.areaId}`
    ) ||
      tramite.tipo?.pasos[tramite.pasoActual]?.actions?.includes(
        `intraAppointment/${user.empleado.areaId}`
      )) &&
    tramite.turno?.length &&
    tramite.turno?.find(
      turno =>
        turno.estado === 'pending' &&
        dayjs().isAfter(dayjs(turno.inicio).startOf('day'))
    )
  );
};

export const puedePedirTurno = tramite => {
  const actions = tramite.tipo?.pasos[tramite.pasoActual].actions;

  if (actions) {
    for (const item of actions) {
      const [action, type] = item.split('/');
      if (action === 'intraAppointment') {
        return [true, Number(type)];
      }
    }
  }

  return [false, null];
};

export const canApproveTramite = tramite => {
  const actions = tramite.tipo?.pasos[tramite.pasoActual].actions;

  if (actions) {
    for (const item of actions) {
      const [action, type] = item.split('/');
      if (action === 'canApproveTramite') {
        return [true, Number(type)];
      }
    }
  }

  return [false, null];
};

export const canGoNextStep = (tramite, user) => {
  const action = tramite?.tipo?.pasos[tramite.pasoActual]?.actions?.find(
    action => action.includes(`canGoNextStep/${user.empleado.areaId}`)
  );

  if (action) {
    let someRequestOrSent = false;

    tramite.tipo.secciones.forEach(seccion =>
      seccion.inputs.forEach(input => {
        if (
          input.InputValues?.estado === 'request' ||
          input.InputValues?.estado === 'sent'
        )
          someRequestOrSent = true;
      })
    );

    return !someRequestOrSent;
  }

  return false;
};

export const canGoPrevStep = (tramite, user) => {
  const action = tramite?.tipo?.pasos[tramite.pasoActual]?.actions?.find(
    action => action.includes(`canGoPrevStep/${user.empleado.areaId}`)
  );

  if (action) {
    let someRequestOrSent = false;

    tramite.tipo.secciones.forEach(seccion =>
      seccion.inputs.forEach(input => {
        if (
          input.InputValues?.estado === 'request' ||
          input.InputValues?.estado === 'sent'
        )
          someRequestOrSent = true;
      })
    );

    return (
      !someRequestOrSent &&
      !tramite.areas?.some(area => area.status === 'rejected') &&
      tramite.areas.some(
        area =>
          area.areaId === user.empleado.areaId &&
          area.status === 'pending' &&
          !area.deleted
      ) &&
      !tramite.areas.some(area => area.status === 'rejected')
    );
  }

  return false;
};

export const canOnlyApproveOrReject = (tramite, user) => {
  return !!(
    tramite?.tipo?.pasos[tramite.pasoActual]?.actions?.includes(
      'approveOrReject'
    ) &&
    tramite.areas.some(
      area =>
        area.areaId === user.empleado.areaId &&
        area.status === 'pending' &&
        !area.deleted
    ) &&
    !tramite.areas.some(area => area.status === 'rejected')
  );
};

export const canOnlyApprove = (tramite, user) => {
  return !!(
    tramite?.tipo?.pasos[tramite.pasoActual]?.actions?.includes(
      `canOnlyApprove/${user?.empleado?.areaId}`
    ) &&
    tramite.areas.some(
      area =>
        area.areaId === user.empleado.areaId &&
        area.status === 'pending' &&
        !area.deleted
    ) &&
    !tramite.areas.some(area => area.status === 'rejected')
  );
};

export const canRejectTramite = (tramite, user) => {
  return (
    user.empleado.area.nombre === 'Legales' &&
    tramite.areas.some(area => area.status === 'rejected' && !area.deleted) &&
    tramite.estado !== 'rechazado'
  );
};

export const canRequestChanges = (tramite, user) => {
  const action = tramite?.tipo?.pasos[tramite.pasoActual]?.actions?.find(
    action => action.includes('canRequestChanges')
  );

  if (action) {
    const [, area] = action.split('/');

    return Number(area) === user.empleado.areaId;
  }

  return false;
};

export const canAddInforme = (tramite, user) => {
  const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];
  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddInformes/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddIntimacion = (tramite, user) => {
  const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];
  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddIntimacion/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddDictamen = (tramite, user) => {
  const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];

  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddDictamen/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddResolucion = (tramite, user) => {
  const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];

  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddResolucion/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddArchivo = (tramite, user) => {
  const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];
  if (pasoActual.actions?.length) {
    const action = pasoActual.actions.find(action =>
      action.includes(`canAddArchivos/${user?.empleado?.areaId}`)
    );

    if (action) {
      const [, tipo] = action.split('_');

      return [true, tipo];
    }
  }

  return [false, null];
};

export const canAddData = (tramite, user) => {
  const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];

  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddDataEmployee/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canGenerateCedula = (tramite, user) => {
  const pasoActual = tramite.tipo?.pasos[tramite.pasoActual];
  if (pasoActual.actions?.length) {
    const action = pasoActual.actions.find(action =>
      action.includes(`generarCedula/${user?.empleado?.areaId}`)
    );
    if (action) {
      const [, tipo] = action.split('_');

      return [true, tipo];
    }
  }

  return [false, null];
};

export const canCancel = tramite => {
  const pasoActual = tramite.pasoActual;
  const paso = tramite.tipo?.pasos[pasoActual];

  return (
    paso.actions &&
    paso.actions.some(action => action.includes('canCancel')) &&
    (tramite.tipo.puedeIniciar === 'empleado' ||
      tramite.tipo.puedeIniciar === 'ambos')
  );
};

export const hideInputs = tramite => {
  const pasoActual = tramite.pasoActual;
  const paso = tramite.tipo?.pasos[pasoActual];

  return (
    paso.actions &&
    paso.actions.some(action => action.includes('hideInputs/employee'))
  );
};
