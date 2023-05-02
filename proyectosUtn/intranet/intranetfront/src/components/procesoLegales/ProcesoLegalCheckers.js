export const canCancel = procesoLegal => {
  const paso = procesoLegal.pasos[procesoLegal.pasoActual];

  return (
    paso.actions && paso.actions.some(action => action.includes('canCancel'))
  );
};

export const canAddArchivo = (procesoLegal, user) => {
  const pasoActual = procesoLegal.pasos[procesoLegal.pasoActual];
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

export const canAddFallos = (procesoLegal, user) => {
  const pasoActual = procesoLegal.pasos[procesoLegal.pasoActual];

  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddFallos/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddDictamen = (procesoLegal, user) => {
  const pasoActual = procesoLegal.pasos[procesoLegal.pasoActual];

  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddDictamen/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddResolucion = (procesoLegal, user) => {
  const pasoActual = procesoLegal.pasos[procesoLegal.pasoActual];

  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddResolucion/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddImputaciones = (procesoLegal, user) => {
  const pasoActual = procesoLegal.pasos[procesoLegal.pasoActual];

  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddImputaciones/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canAddInforme = (procesoLegal, user) => {
  const pasoActual = procesoLegal.pasos[procesoLegal.pasoActual];
  if (
    pasoActual.actions?.length &&
    pasoActual.actions.includes(`canAddInformes/${user?.empleado?.areaId}`)
  ) {
    return true;
  }
  return false;
};

export const canGenerateCedula = (procesoLegal, user) => {
  const pasoActual = procesoLegal.pasos[procesoLegal.pasoActual];
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

export const canGoNextStep = (procesoLegal, user) => {
  const action = procesoLegal.pasos[procesoLegal.pasoActual]?.actions?.find(
    action => action.includes(`canGoNextStep/${user.empleado.areaId}`)
  );

  if (action) {
    return true;
  }

  return false;
};

export const canGoPrevStep = (procesoLegal, user) => {
  const action = procesoLegal.pasos[procesoLegal.pasoActual]?.actions?.find(
    action => action.includes(`canGoPrevStep/${user.empleado.areaId}`)
  );

  if (action) {
    return true;
  }

  return false;
};

export const canOnlyApproveOrReject = (procesoLegal, user, expediente) => {
  const action = procesoLegal.pasos[procesoLegal.pasoActual]?.actions?.find(a =>
    a.includes('approveOrReject')
  );

  if (
    action &&
    expediente.areas.some(
      area =>
        area.areaId === user.empleado.areaId &&
        area.status === 'pending' &&
        !area.deleted
    ) &&
    !expediente.areas.some(area => area.status === 'rejected')
  ) {
    const [, tipo] = action.split('/');
    const [aprobar, rechazar] = tipo.split(':');

    return [true, { aprobar, rechazar }];
  }

  return [false, null];
};

export const canOnlyApprove = (procesoLegal, user, expediente) => {
  const action = procesoLegal.pasos[procesoLegal.pasoActual]?.actions?.find(a =>
    a.includes('canOnlyApprove')
  );

  if (
    action &&
    expediente.areas.some(
      area =>
        area.areaId === user.empleado.areaId &&
        area.status === 'pending' &&
        !area.deleted
    ) &&
    !expediente.areas.some(area => area.status === 'rejected')
  ) {
    const [, tipo] = action.split('/');
    const [areaId, titulo] = tipo.split('_');

    return [Number(areaId) === user.empleado.areaId, titulo];
  }

  return [false, null];
};
