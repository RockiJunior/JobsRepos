export const goto = {
  allAreasApproved: (paso: number) => `allAreasApproved/${paso}`,
  tipoCedula: (tipoCedula: 'electronica' | 'fisica', paso: number) =>
    `tipoCedula/${tipoCedula}_${paso}`,
  allInputsApproved: (paso: number) => `allInputsApproved/${paso}`,
  denunciante: (denunciante: 'cucicba' | 'noCucicba', paso: number) =>
    `denunciante/${denunciante}_${paso}`,
  eventApproved: (tipo: string, paso: number) => `eventApproved/${tipo}_${paso}`
};
