export function getNotificationDescription({
  estado,
  tituloSeccion,
  tramiteId
}: {
  estado: string;
  tituloSeccion: string;
  tramiteId: number;
}) {
  switch (estado) {
    case 'approved':
      return `La sección ${tituloSeccion} del trámite ${tramiteId} fue aprobada`;

    case 'request':
      return `La sección ${tituloSeccion} del trámite ${tramiteId} necesita modificación`;

    case 'rejected':
      return `La sección ${tituloSeccion} del trámite ${tramiteId} fue rechazada`;

    default:
      return `La sección ${tituloSeccion} del trámite ${tramiteId} fue modificada`;
  }
}

export function getNotificationDescriptionExpediente({
  estado,
  tituloSeccion,
  expedienteId
}: {
  estado: string;
  tituloSeccion: string;
  expedienteId: number;
}) {
  switch (estado) {
    case 'approved':
      return `La sección ${tituloSeccion} del trámite ${expedienteId} fue aprobada`;

    case 'request':
      return `La sección ${tituloSeccion} del trámite ${expedienteId} necesita modificación`;

    case 'rejected':
      return `La sección ${tituloSeccion} del trámite ${expedienteId} fue rechazada`;

    default:
      return `La sección ${tituloSeccion} del trámite ${expedienteId} fue modificada`;
  }
}
