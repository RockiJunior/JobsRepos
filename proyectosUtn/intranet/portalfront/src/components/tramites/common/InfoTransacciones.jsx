import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const InfoTransacciones = ({ show, setShow }) => {
  return (
    <Modal show={show} size="lg" centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Información sobre los pagos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Pago único:</strong> Abonar el arancel con una bonificación en
          un único pago efectuando una transferencia o depósito bancario. (
          <strong className="text-danger">*</strong>)
        </p>
        <p>
          <strong>En cuotas:</strong> Abonar el arancel financiando el pago en
          cuotas sin interés según detalle a continuación:
        </p>
        <ul>
          <li>
            Primer pago: Deberá efectuar una transferencia o depósito bancario.(
            <strong className="text-danger">*</strong>)
          </li>
          <li>
            Pagos posteriores: Firmará un compromiso de pago por débito directo
            de CBU. (<strong className="text-danger">#</strong>)
          </li>
        </ul>
        <p>
          (<strong className="text-danger">*</strong>){' '}
          <strong>Banco Santander Río</strong>
        </p>
        <ul>
          <li>Cta. Cte Nº: 000-030790/3</li>
          <li>Sucursal Nº: 000 Casa Matriz</li>
          <li>CBU: 0720000720000003079036</li>
          <li>Cuit: 33-71103057-9</li>
        </ul>

        <p>
          (<strong className="text-danger">#</strong>){' '}
          <strong>
            Para la firma del compromiso de pago a través del débito directo
            deberá subir al sistema junto al comprobante del primer pago la
            constancia de su CBU (sin excepción) donde conste la titularidad de
            la cuenta (Nombre y Apellido y/o DNI y/o CUIT). No serán válidos CBU
            de cuentas vinculadas al cobro de la seguridad social y/o de bancos
            digitales para la adhesión al débito automático.
          </strong>
        </p>
      </Modal.Body>
    </Modal>
  );
};

InfoTransacciones.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default InfoTransacciones;
