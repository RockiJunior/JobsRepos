/* import areas from '../../areas';
import tramites from '../../tramites';
import { actions } from '../actions/actions';
import { nextConditions } from '../actions/nextConditions';
import { prevConditions } from '../actions/prevConditions';
import { getS } from '../variables';
import TipoTramite from './interfaceTipoTramite';

const tramitePrueba: TipoTramite = {
  titulo: 'Trámite de Prueba',
  id: tramites.tramitePrueba,
  plazo: 180,
  areaId: areas.fiscalizacion,
  tipo: 'tramite',
  puedeIniciar: 'empleado',
  requiere: 'noMatricula',
  descripcion: `El alta de matriculación es un trámite que se realiza para obtener la matrícula profesional`,
  pasos: [
    {
      id: 0,
      variant: 'success',
      title: 'Libro Rubricado',
      description: `El libro rubricado es un documento que se utiliza para realizar la firma de documentos.`,
      nextConditions: [nextConditions.allInputsApproved()],
      intraTitle: 'Libro Rubricado'
    },
    {
      id: 1,
      variant: 'success',
      title: 'Debes abonar los gastos del libro',
      description: '',
      actions: [
        actions.createTransaction([
          {
            nombre: 'libroRubricado',
            condicion: 'input:libroRubricado'
          }
        ])
      ],
      nextConditions: [
        nextConditions.sentTransaction([
          {
            nombre: 'libroRubricado',
            condicion: 'input:libroRubricado'
          }
        ])
      ],
      intraTitle: 'Pago de gastos del libro'
    },
    {
      id: 2,
      variant: 'info',
      title: 'Debes abonar los gastos del libro',
      description: '',
      prevConditions: [prevConditions.someTransactionRequest()],
      nextConditions: [
        nextConditions.transactionApproved([
          {
            nombre: 'libroRubricado',
            condicion: 'input:libroRubricado'
          }
        ])
      ],
      intraTitle: 'Pago de gastos del libro'
    },
    {
      id: 0,
      variant: 'success',
      title:
        'Tu documentación ha sido presentada y será revisada por otras áreas',
      description: `Se te podrán solicitar cambios en tu documentación`,
      actions: [
        actions.canGoNextStep(areas.fiscalizacion),
        actions.tipoSeccion('infraccion'),
        actions.canAddDataEmployee(areas.fiscalizacion),
        actions.cantAddDataUser()
      ],
      intraTitle: 'Fiscalización ',
      intraDescription: 'Fiscalización'
    },
    {
      id: 1,
      variant: 'success',
      title: 'Debes abonar los gastos de matriculación',
      description: `Para poder continuar con el trámite, debes abonar los conceptos de "Inscripción, Matrícula Anual, Fianza Fiduciaria " y "Multa" en caso que la tengas. <br/>
        Podes acercarte a las oficinas de CUCICBA y pagar en efectivo o enviar una transferencia bancaria a...`,
      actions: [
        actions.createTransaction([
          {
            nombre: 'matriculacion2'
          },
          {
            nombre: 'infraccionAntesDeMatricularse1',
            condicion: 'input:infraccionAntesDeMatricularse'
          }
        ]),
        actions.cantAddDataUser()
      ],
      nextConditions: [
        nextConditions.sentTransaction([
          {
            nombre: 'matriculacion2'
          },
          {
            nombre: 'infraccionAntesDeMatricularse1',
            condicion: 'input:infraccionAntesDeMatricularse'
          }
        ])
      ],
      intraTitle: 'Pago de gastos de Matriculación',
      intraDescription:
        'El aspirante debe abonar los gastos de matriculación y subir el comprobante.'
    },
    {
      id: 2,
      variant: 'info',
      title: 'Debes abonar los gastos de matriculación',
      description: `Para poder continuar con el trámite, debes abonar la matrícula, aranceles y fianza fiduciaria. <br/>
        Podes acercarte a las oficinas de CUCICBA y pagar en efectivo o enviar una transferencia bancaria a...`,
      prevConditions: [prevConditions.someTransactionRequest()],
      nextConditions: [
        nextConditions.transactionApproved([
          {
            nombre: 'matriculacion2'
          },
          {
            nombre: 'infraccionAntesDeMatricularse1',
            condicion: 'input:infraccionAntesDeMatricularse'
          }
        ])
      ],
      actions: [actions.cantAddDataUser()],
      intraTitle: 'Pago de gastos de matriculación',
      intraDescription: 'Finanzas debe aprobar los pagos de matriculación.'
    },
    {
      id: 3,
      variant: 'success',
      title: 'Transacción aprobada',
      description: `La transacción ha sido aprobada y el trámite se encuentra en estado "En Proceso"`,
      intraTitle: 'Transacción aprobada'
    }
  ],
  secciones: [
    {
      id: getS(),
      titulo: 'Datos del Aspirante',
      inputs: [
        {
          nombre: 'nombre',
          requerido: [true]
        },
        {
          nombre: 'libroRubricado',
          requerido: [false]
        }
      ]
    },
    {
      id: getS(),
      titulo: 'Infracción/nes',
      tipo: 'infraccion',
      inputs: [
        {
          nombre: 'infraccionAntesDeMatricularse',
          requerido: [false]
        },
        {
          nombre: 'arancelesFiscalizacion',
          requerido: [false, 'infraccionAntesDeMatricularse'],
          padre: 'infraccionAntesDeMatricularse'
        },
        {
          nombre: 'infraccionAntesDeMatricularseMonto',
          requerido: [false, 'infraccionAntesDeMatricularse'],
          padre: 'infraccionAntesDeMatricularse'
        }
      ]
    }
  ]
};

export default tramitePrueba;
 */
