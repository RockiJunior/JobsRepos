import React from 'react';
import es from 'date-fns/locale/es';
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  FormLabel,
  InputGroup,
  Row
} from 'react-bootstrap';
import { registerLocale } from 'react-datepicker';
import { propertyList } from '../../../mockup/props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
registerLocale('es', es);

const propertiesTypeMockup = propertyList.sort((a, b) =>
  a.label > b.label ? 1 : -1
);

const ListFilterComponent = ({
  setFiltersAndSort,
  filtersAndSort,
  branchOffices,
  branchOffice,
  setBranchOffice,
  submitSearch,
  searching
}) => {
  const [searchProp, setSearchProp] = React.useState('');

  return (
    <Card className="bg-white">
      <Card.Body>
        <Card.Title className="border-bottom pb-2">Filtrar Por:</Card.Title>

        <Row className="g-3">
          <FormGroup as={Col} xs={12}>
            <FormLabel>Buscar</FormLabel>

            <InputGroup>
              <Form.Control
                type="text"
                size="sm"
                value={searchProp}
                placeholder="..."
                onChange={e => setSearchProp(e.target.value)}
                disabled={searching}
              />
              <InputGroup.Text className="p-0" style={{ overflow: 'hidden' }}>
                {searching ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      submitSearch('');
                      setSearchProp('');
                    }}
                    className="rounded-0"
                  >
                    <FontAwesomeIcon icon={['fas', 'times']} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => submitSearch(searchProp)}
                    className="rounded-0"
                  >
                    <FontAwesomeIcon icon={['fas', 'search']} />
                  </Button>
                )}
              </InputGroup.Text>
            </InputGroup>
          </FormGroup>

          <FormGroup as={Col} xs={12} sm={6} md={3} lg={12}>
            <FormLabel>Tipo de Operación</FormLabel>

            <Form.Select
              size="sm"
              onChange={e =>
                setFiltersAndSort(state => ({
                  ...state,
                  operation: Number(e.target.value)
                }))
              }
              value={filtersAndSort.operation}
            >
              <option value={0}>Todos</option>
              <option value={1}>Ventas</option>
              <option value={2}>Alquileres</option>
              <option value={3}>Temporarios</option>
            </Form.Select>
          </FormGroup>

          <FormGroup as={Col} xs={12} sm={6} md={3} lg={12}>
            <FormLabel>Tipo de Propiedad</FormLabel>

            <Form.Select
              size="sm"
              onChange={e =>
                setFiltersAndSort(state => ({
                  ...state,
                  property: Number(e.target.value)
                }))
              }
              value={filtersAndSort.property}
            >
              <option value={0}>Todos</option>

              {propertiesTypeMockup &&
                propertiesTypeMockup?.map((prop, index) => {
                  return (
                    <option key={index} value={prop.id}>
                      {prop.label}
                    </option>
                  );
                })}
            </Form.Select>
          </FormGroup>

          <FormGroup as={Col} xs={12} sm={6} md={3} lg={12}>
            <FormLabel>Estado</FormLabel>

            <Form.Select
              size="sm"
              onChange={e =>
                setFiltersAndSort(state => ({
                  ...state,
                  status: e.target.value
                }))
              }
              value={filtersAndSort.status}
            >
              <option value={'all'}>Todos</option>
              <option value={'published'}>Activas</option>
              <option value={'pending'}>Pendientes</option>
              <option value={'paused'}>Pausadas</option>
              <option value={'finished'}>Finalizadas</option>
            </Form.Select>
          </FormGroup>

          <FormGroup as={Col} xs={12} sm={6} md={3} lg={12}>
            <FormLabel>Sucursal</FormLabel>

            <Form.Select
              size="sm"
              value={branchOffice}
              onChange={e => {
                setBranchOffice(Number(e.target.value));
                setFiltersAndSort({
                  ...filtersAndSort,
                  branchOffices:
                    e.target.value !== '0'
                      ? [Number(e.target.value)]
                      : branchOffices.map(office => Number(office.id))
                });
              }}
            >
              <option key={0} value={0}>
                Todas
              </option>

              {branchOffices &&
                branchOffices?.map(office => {
                  return (
                    <option
                      key={office?.id}
                      /* selected={branchOffice === office?.id} */
                      value={office?.id}
                    >
                      {office?.branch_office_name}
                    </option>
                  );
                })}
            </Form.Select>
          </FormGroup>

          <FormGroup
            className="d-flex align-items-center justify-content-end"
            as={Col}
            xs={12}
          >
            {filtersAndSort.status === 'all' && (
              <div
                className="d-flex align-items-center"
                style={{ maxWidth: 200 }}
              >
                <Form.Check
                  type="switch"
                  onChange={e =>
                    setFiltersAndSort({
                      ...filtersAndSort,
                      finisheds: !filtersAndSort.finisheds
                    })
                  }
                />
                <label className="m-0">Incluir finalizadas</label>
              </div>
            )}
          </FormGroup>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ListFilterComponent;
