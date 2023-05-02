import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Flex from 'components/common/Flex';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';

const ListOrderComponent = ({
  type,
  setType,
  page,
  propsLimit,
  totalProps,
  setPropsLimit,
  filtersAndSort,
  setFiltersAndSort
}) => {
  const [isAsc, setIsAsc] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('updated_at');
  const [totalItems, setTotalItems] = React.useState(0);
  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(0);
  const [pageIndex, setPageIndex] = React.useState(page - 1);
  const rowsPerPageOptions = [10, 15, 20, 25];

  useEffect(() => {
    setPageIndex(page - 1);
    setFrom(propsLimit * pageIndex + 1);
    setTo(propsLimit * page > totalProps ? totalProps : propsLimit * page);
    setTotalItems(totalProps);
  }, [propsLimit, page, totalProps, pageIndex]);

  useEffect(() => {
    setFiltersAndSort(prev => ({
      ...prev,
      sortBy: {
        order: !isAsc ? 'desc' : 'asc',
        prop: sortBy
      }
    }));
  }, [sortBy, isAsc]);

  return (
    <>
      <Card className="mb-1 bg-white">
        <Card.Body>
          <Row className="flex-between-center">
            <Col
              sm="auto"
              as={Flex}
              alignItems="center"
              className="mb-2 mb-sm-0"
            >
              <Form.Select
                size="sm"
                value={propsLimit}
                onChange={e => setPropsLimit(e.target.value)}
                style={{ maxWidth: '4.875rem' }}
              >
                {rowsPerPageOptions.map(value => {
                  return (
                    <option key={`option_${value}`} value={value}>
                      {value}
                    </option>
                  );
                })}
              </Form.Select>
              <h6 className="mb-0 ms-2">
                {from}-{to} de {totalItems}
              </h6>
            </Col>

            <Col sm="auto">
              <Row className="gx-2 align-items-center">
                {type !== 'table' && (
                  <Col xs="auto">
                    <Form as={Row} className="gx-2">
                      <Col xs="auto">
                        <small>Ordernar por:</small>
                      </Col>
                      <Col xs="auto">
                        <InputGroup size="sm">
                          <Form.Select
                            className="pe-5"
                            value={filtersAndSort.sortBy.prop}
                            onChange={({ target }) => setSortBy(target.value)}
                          >
                            <option value="updated_at">
                              Última Actualización
                            </option>
                            <option value="price">Precio</option>
                            <option value="address">Dirección</option>
                            <option value="operation">Operación</option>
                            <option value="type">Tipo de Inmueble</option>
                            <option value="status">Estado</option>
                            {/* <option value="rating">Más Vistas</option>
                            <option value="review">Más Consultadas</option> */}
                          </Form.Select>
                          <InputGroup.Text
                            as={Button}
                            variant="primary"
                            onClick={() => setIsAsc(!isAsc)}
                          >
                            <FontAwesomeIcon
                              icon={
                                isAsc ? 'sort-amount-up' : 'sort-amount-down'
                              }
                            />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </Form>
                  </Col>
                )}
                <Col xs="auto" className="pe-0">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>{type === 'table' ? 'Cartas' : 'Lista'}</Tooltip>
                    }
                  >
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() =>
                        setType(type === 'cards' ? 'table' : 'cards')
                      }
                    >
                      <FontAwesomeIcon
                        icon={classNames({
                          th: type === 'table',
                          'list-ul': type === 'cards'
                        })}
                      />
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

ListOrderComponent.propTypes = {
  type: PropTypes.string.isRequired,
  setType: PropTypes.func.isRequired
};

export default ListOrderComponent;
