import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { months, weekdays } from 'dayjs/locale/es';
import SoftBadge from 'components/common/SoftBadge';
import { CustomCard } from 'components/common/CustomCard';
import ViewFileLinkArrayModal from 'components/common/ViewFileLinkArrayModal';
import { Link } from 'react-router-dom';
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: months.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
  weekdays: weekdays.map(w => w.charAt(0).toUpperCase() + w.slice(1))
});

const getValue = (item, input, className) => {
  let value = item?.value;
  let archivos = item?.archivos;

  if (input.tipo === 'file' && archivos) {
    return (
      <p className={className}>
        {input.titulo}:{' '}
        <ViewFileLinkArrayModal previews={archivos} alt={input.titulo} />
      </p>
    );
  }

  if (value === null || value === undefined) {
    return null;
  }

  if (input.tipo === 'date') {
    return (
      <p className={className}>
        {input.titulo}: <strong>{dayjs(value).format('DD/MM/YYYY')}</strong>
      </p>
    );
  }

  if (value === true) {
    return (
      <p className={className}>
        {input.titulo}: <strong>Si</strong>
      </p>
    );
  }

  if (value === false) {
    return (
      <p className={className}>
        {input.titulo}: <strong>No</strong>
      </p>
    );
  }

  if (input.nombre === 'estadoCivil') {
    return (
      <p className={className}>
        {input.titulo}: <strong>{value}</strong>
      </p>
    );
  }

  return (
    <p className={className}>
      {input.titulo}: <strong>{value.split('/').join(', ')}</strong>
    </p>
  );
};

const getBadge = (value, actividadComercial) => {
  switch (value) {
    case 'activo':
      return (
        <div className="text-end">
          <SoftBadge
            className="fs-2"
            bg={actividadComercial ? 'success' : 'warning'}
          >
            Activa
          </SoftBadge>
          {!actividadComercial && (
            <p className="m-0 mt-2 fs--1 text-danger">
              *Recordá que para poder ejercer la profesión debes realizar la{' '}
              <Link
                className="text-danger"
                style={{ textDecoration: 'underline' }}
                to="/tramites/declaracion-jurada-de-datos-comerciales"
              >
                Declaración Jurada de Actividad Comercial
              </Link>
            </p>
          )}
        </div>
      );

    case 'inactivo':
      return (
        <SoftBadge className="fs-2" bg="danger">
          Inactiva
        </SoftBadge>
      );

    case 'pendiente':
      return (
        <SoftBadge className="fs-2" bg="secondary">
          Pendiente
        </SoftBadge>
      );

    case 'pasiva':
      return (
        <SoftBadge className="fs-2" bg="info">
          Pasiva
        </SoftBadge>
      );
  }
};

const data = {
  datosPersonales: [
    {
      nombre: 'nombre',
      tipo: 'text',
      titulo: 'Nombre'
    },
    {
      nombre: 'apellido',
      tipo: 'text',
      titulo: 'Apellido'
    },
    {
      nombre: 'apellidoMaterno',
      tipo: 'text',
      titulo: 'Apellido Materno'
    },
    {
      nombre: 'fechaNacimiento',
      tipo: 'date',
      titulo: 'Fecha de Nacimiento'
    },
    {
      nombre: 'lugarNacimiento',
      tipo: 'text',
      titulo: 'Lugar de Nacimiento'
    },
    {
      nombre: 'nacionalidad',
      tipo: 'text',
      titulo: 'Nacionalidad'
    },
    {
      nombre: 'dni',
      tipo: 'text',
      titulo: 'DNI'
    },
    {
      nombre: 'cuitCuil',
      tipo: 'text',
      titulo: 'CUIT/CUIL'
    },
    {
      nombre: 'sexo',
      tipo: 'text',
      titulo: 'Sexo'
    },
    {
      nombre: 'estadoCivil',
      tipo: 'text',
      titulo: 'Estado Civil'
    }
  ],

  documentacionPersonal: [
    {
      nombre: 'fotoCarnet',
      tipo: 'file',
      titulo: 'Foto Carnet'
    },
    {
      nombre: 'frenteDNI',
      tipo: 'file',
      titulo: 'Frente de DNI'
    },
    {
      nombre: 'dorsoDNI',
      tipo: 'file',
      titulo: 'Dorso de DNI'
    },
    {
      nombre: 'escaneoFirma',
      tipo: 'file',
      titulo: 'Escaneo de Firma'
    },
    {
      nombre: 'acreditacionDomicilioCABA',
      tipo: 'file',
      titulo: 'Acreditación de Domicilio en CABA'
    }
  ],

  datosContacto: [
    {
      nombre: 'domicilioReal',
      tipo: 'text',
      titulo: 'Domicilio Real'
    },
    {
      nombre: 'codigoPostalReal',
      tipo: 'text',
      titulo: 'Código Postal Real'
    },
    {
      nombre: 'domicilioLegal',
      tipo: 'text',
      titulo: 'Domicilio Legal'
    },
    {
      nombre: 'codigoPostalLegal',
      tipo: 'text',
      titulo: 'Código Postal Legal'
    },
    {
      nombre: 'celularParticular',
      tipo: 'text',
      titulo: 'Celular'
    },
    {
      nombre: 'telefonoParticular',
      tipo: 'text',
      titulo: 'Teléfono Particular'
    },
    {
      nombre: 'mailParticular',
      tipo: 'text',
      titulo: 'Mail Particular'
    },
    {
      nombre: 'mailAlterrnativo',
      tipo: 'text',
      titulo: 'Mail Alternativo'
    }
  ],

  datosAcademicos: [
    {
      nombre: 'nombreUniversidad',
      tipo: 'text',
      titulo: 'Nombre de la Universidad'
    },
    {
      nombre: 'localidadUniversidad',
      tipo: 'text',
      titulo: 'Localidad de la Universidad'
    },
    {
      nombre: 'fechaInicioCarrera',
      tipo: 'date',
      titulo: 'Fecha de Inicio de la Carrera'
    },
    {
      nombre: 'fechaFinCarrera',
      tipo: 'date',
      titulo: 'Fecha de Fin de la Carrera'
    },
    {
      nombre: 'carreraUniversidad',
      tipo: 'text',

      titulo: 'Carrera Universitaria'
    },
    {
      nombre: 'tituloUniversitario',
      tipo: 'file',
      titulo: 'Título Universitario'
    },
    {
      nombre: 'certificadoAnalitico',
      tipo: 'file',
      titulo: 'Certificado Analítico'
    }
  ],

  actividadComercial: [
    {
      nombre: 'actividadComercial',
      tipo: 'checkbox',
      titulo: 'Actividad Comercial'
    },
    {
      nombre: 'nombreFantasia',
      titulo: 'Nombre de Fantasía',
      tipo: 'text'
    },
    {
      nombre: 'emailComercial',
      titulo: 'Email Comercial',
      tipo: 'text'
    },
    {
      nombre: 'telefonoComercial',
      titulo: 'Teléfono Comercial',
      tipo: 'text'
    },
    {
      nombre: 'domicilioComercial',
      titulo: 'Domicilio Comercial',
      tipo: 'text'
    },
    {
      nombre: 'codigoPostalComercial',
      titulo: 'Código Postal Comercial',
      tipo: 'text'
    },
    {
      nombre: 'domicilioCasaCentral',
      titulo: 'Domicilio Casa Central',
      tipo: 'text'
    },
    {
      nombre: 'telefonoCasaCentral',
      titulo: 'Teléfono Casa Central',
      tipo: 'text'
    },
    {
      nombre: 'domicilioSucursal1',
      titulo: 'Domicilio Sucursal 1',
      tipo: 'text'
    },
    {
      nombre: 'telefonoSucursal1',
      titulo: 'Teléfono Sucursal 1',
      tipo: 'text'
    },
    {
      nombre: 'facturaDireccionSucursal1',
      titulo: 'Factura a domicilio de sucursal 1',
      tipo: 'file'
    },

    {
      nombre: 'domicilioSucursal2',
      titulo: 'Domicilio Sucursal 2',
      tipo: 'text'
    },
    {
      nombre: 'telefonoSucursal2',
      titulo: 'Teléfono Sucursal 2',
      tipo: 'text'
    },
    {
      nombre: 'facturaDireccionSucursal2',
      titulo: 'Factura a domicilio de sucursal 2',
      tipo: 'file'
    },
    {
      nombre: 'constanciaInscripcionAfip',
      titulo: 'Constancia de Inscripción en AFIP',
      tipo: 'file'
    },
    {
      nombre: 'comprobanteIngresosBrutos',
      titulo: 'Comprobante de Ingresos Brutos',
      tipo: 'file'
    },
    {
      nombre: 'facturaElectronica',
      titulo: 'Factura Electrónica emitida por $0.01',
      tipo: 'file'
    },

    {
      nombre: 'marcaRegistradaNombre',
      titulo: 'Nombre de la marca registrada',
      tipo: 'text'
    },
    {
      nombre: 'marcaRegistradaRegistroInpi',
      titulo: 'Registro INPI',
      tipo: 'file'
    },
    {
      nombre: 'marcaRegistradaHojaBocba',
      titulo: 'Hoja del BOCBA',
      tipo: 'file'
    },
    {
      nombre: 'marcaRegistradaCesion',
      titulo: 'Copia certifica por escribano público de la cesión',
      tipo: 'file'
    },

    {
      nombre: 'nombreSociedad',
      titulo: 'Nombre de la sociedad',
      tipo: 'text'
    },
    {
      nombre: 'razónSocial',
      titulo: 'Razón Social',
      tipo: 'text'
    },
    {
      nombre: 'porcentajeSociedad',
      titulo: 'Porcentaje de la sociedad',
      tipo: 'text'
    },
    {
      nombre: 'copiaEstatutoSociedad',
      titulo: 'Copia del Estatuto de la sociedad',
      tipo: 'file'
    }
  ]
};

const MisDatos = () => {
  const { user } = useSelector(state => state.authReducer);

  return (
    <CustomCard icon="id-card" title="Mis Datos">
      <Card className="bg-white">
        <Card.Body>
          <Row className="g-0">
            {user.matricula[0] && (
              <Col xs={12} className="p-3">
                <Card
                  style={{
                    boxShadow: 'none',
                    border: '2px solid var(--falcon-primary)',
                    maxWidth: '450px'
                  }}
                >
                  <Card.Header>
                    <Card.Title className="fs-1">
                      Matricula nroº {user.matricula[0].id}
                    </Card.Title>
                    <Card.Subtitle>
                      {dayjs(user.matricula[0].fecha).format(
                        'D [de] MMMM [de] YYYY'
                      )}
                    </Card.Subtitle>
                    <div
                      style={{ flexWrap: 'wrap' }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div style={{ flexWrap: 'wrap' }} className="d-flex mt-2">
                        <p className="me-2 mb-0">
                          Libro: <strong>{user.matricula[0].libro}</strong>
                        </p>

                        <p className="me-2 mb-0">
                          Tomo: <strong>{user.matricula[0].tomo}</strong>
                        </p>

                        <p className="mb-0">
                          Folio: <strong>{user.matricula[0].folio}</strong>
                        </p>
                      </div>

                      <div className="mt-2 ps-2 w-100 d-flex justify-content-end">
                        {getBadge(
                          user.matricula[0].estado,
                          user.datos.actividadComercial
                        )}
                      </div>
                    </div>
                  </Card.Header>
                </Card>
              </Col>
            )}

            <Col xs={12}>
              <Row className="g-0">
                <Col xs={12} md={6} xxl={4}>
                  <Card className="bg-white" style={{ boxShadow: 'none' }}>
                    <Card.Header className="pb-0">
                      <Card.Title className="fs-1">Datos Personales</Card.Title>
                      <hr className="mt-0" />
                    </Card.Header>
                    <Card.Body>
                      <Card.Text as={Row}>
                        {data.datosPersonales.map(d => {
                          return (
                            <Col key={d} xs={12}>
                              {getValue(user?.datos[d.nombre], d, 'mb-1')}
                            </Col>
                          );
                        })}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={6} xxl={4}>
                  <Card className="bg-white" style={{ boxShadow: 'none' }}>
                    <Card.Header className="pb-0">
                      <Card.Title className="fs-1">
                        Datos de Contacto
                      </Card.Title>
                      <hr className="mt-0" />
                    </Card.Header>
                    <Card.Body>
                      <Card.Text as={Row}>
                        {data.datosContacto.map(d => {
                          return (
                            <Col key={d} xs={12}>
                              {getValue(user?.datos[d.nombre], d, 'mb-1')}
                            </Col>
                          );
                        })}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={6} xxl={4}>
                  <Card className="bg-white" style={{ boxShadow: 'none' }}>
                    <Card.Header className="pb-0">
                      <Card.Title className="fs-1">
                        Documentación Personal
                      </Card.Title>
                      <hr className="mt-0" />
                    </Card.Header>
                    <Card.Body>
                      <Card.Text as={Row}>
                        {data.documentacionPersonal.map(d => {
                          return (
                            <Col key={d} xs={12}>
                              {getValue(user?.datos[d.nombre], d, 'mb-1')}
                            </Col>
                          );
                        })}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={6} xxl={4}>
                  <Card className="bg-white" style={{ boxShadow: 'none' }}>
                    <Card.Header className="pb-0">
                      <Card.Title className="fs-1">Datos Académicos</Card.Title>
                      <hr className="mt-0" />
                    </Card.Header>
                    <Card.Body>
                      {console.log(user?.datos)}
                      <Card.Text as={Row}>
                        {data.datosAcademicos.map(d => {
                          return (
                            <Col key={d} xs={12}>
                              {getValue(user?.datos[d.nombre], d, 'mb-1')}
                            </Col>
                          );
                        })}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} xxl={8}>
                  <Card className="bg-white" style={{ boxShadow: 'none' }}>
                    <Card.Header className="pb-0">
                      <Card.Title className="fs-1">
                        Actividad Comercial
                      </Card.Title>
                      <hr className="mt-0" />
                    </Card.Header>
                    <Card.Body>
                      <Card.Text as={Row}>
                        {data.actividadComercial.map(d => {
                          return (
                            <Col key={d} xs={12} lg={6}>
                              {getValue(user?.datos[d.nombre], d, 'mb-1')}
                            </Col>
                          );
                        })}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </CustomCard>
  );
};

export default MisDatos;
