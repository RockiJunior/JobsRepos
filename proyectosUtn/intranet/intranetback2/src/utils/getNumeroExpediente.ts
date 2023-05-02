export const getNumeroExpediente = ({
  numeroLegales,
  numeroFiscalizacion
}: {
  numeroLegales: string | null;
  numeroFiscalizacion: string | null;
}) => {
  return `${numeroLegales || ''}${
    numeroLegales && numeroFiscalizacion ? '/' : ''
  }${numeroFiscalizacion || ''}`;
};

export const addNumeroLegales = (numeroLegales: string) => {
  const numero = numeroLegales.replace('L-', '');
  return `L-${Number(numero) + 1}`;
};

export const addNumeroFiscalizacion = (numeroFiscalizacion: string) => {
  const numero = numeroFiscalizacion.replace('F-', '');
  return `F-${Number(numero) + 1}`;
};
