import PageHeader from 'components/common/PageHeader';
import AdvanceTablePagination from 'components/common/usersTable/AdvanceTablePagination';
import moment from 'moment';
import 'moment/locale/es';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPropertiesByFilters } from 'redux/propsSlice';
import { HavePermission } from 'utils/HavePermission';
import ButtonCreate from 'utils/buttons/buttonCreate';
import { informacion, propsColumns } from '../mockup/props';
import PropsCards from './propertiesTable/PropsCards';
import PropsTable from './propertiesTable/PropsTable';
import { listaBarrios } from '../mockup/barrios';
import ListFilterComponent from './propertiesTable/components/ListFilterComponent';
import ListOrderComponent from './propertiesTable/components/ListOrderComponent';
import dayjs from 'dayjs';
import { PropActions } from './propertiesTable/components/PropActions';
moment.locale('es');

const propStatusObj = {
  pending: 'Pendiente',
  published: 'Activa',
  paused: 'Pausada',
  deleted: 'Eliminada',
  finished: 'Finalizada'
};

const ListaPropiedades = () => {
  //Hooks e informacion base del usuario
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userLogged = useSelector(state => state.login.currentUser);

  const branchOffices = userLogged?.branchOffices;

  const rolesUser = useSelector(state => state.roles.rolesById);
  const permisos = [];
  if (userLogged?.typeOfUser !== 'admin') {
    userLogged?.roles.map(roles =>
      rolesUser[roles.id]?.roleToPermission.map(
        permiso =>
          permisos.indexOf(permiso.permission.id) === -1 &&
          permisos.push(permiso.permission.id)
      )
    );
  }
  //State para render
  const [checkChanges, setCheckChanges] = useState(false);

  //Estado base
  const [data, setData] = useState();

  //Estado para oficina actual y lista de props
  const properties = useSelector(state => state.props.branchOfficeProps);

  const [branchOffice, setBranchOffice] = useState(0);

  useEffect(() => {
    setBranchOffice(branchOffices && branchOffices[0]?.id);
    setFiltersAndSort({
      ...filtersAndSort,
      branchOffices: [branchOffices && branchOffices[0]?.id]
    });
  }, [branchOffices]);

  //Estados para paginacion
  const [page, setPage] = useState({ number: 1 });
  const [propsLimit, setPropsLimit] = useState(10);
  const [totalProps, setTotalProps] = useState(0);
  const [filtersAndSort, setFiltersAndSort] = useState({
    branchOffices: [branchOffice],
    status: 'all',
    property: 0,
    operation: 0,
    finisheds: false,
    sortBy: {
      prop: '',
      order: ''
    }
  });

  //Estado para búsqueda
  const [searchProp, setSearchProp] = useState('');

  //filtrado y sort de propiedades mostradas
  const [filtredProps, setFiltredProps] = useState(properties?.list);

  const [type, setType] = useState('cards');

  //Get props

  useEffect(() => {
    if (branchOffices && page && filtersAndSort && propsLimit) {
      dispatch(
        getPropertiesByFilters(
          filtersAndSort,
          page.number,
          propsLimit,
          token,
          searchProp
        )
      );

      window.scrollTo(0, 0);
    }
  }, [page]);

  useEffect(() => {
    setPage({ number: 1 });
  }, [branchOffices, filtersAndSort, propsLimit, searchProp]);

  useEffect(() => {
    if (branchOffices && page && filtersAndSort && propsLimit) {
      dispatch(
        getPropertiesByFilters(
          filtersAndSort,
          page.number,
          propsLimit,
          token,
          searchProp
        )
      );
    }
  }, [checkChanges]);

  //inicializo las dos listas de propiedades en base a la lista actual
  useEffect(() => {
    if (properties) {
      setFiltredProps(properties.list);
      setTotalProps(properties?.length);
    }
  }, [properties]);

  const submitSearch = value => {
    setSearchProp(value);
  };

  useEffect(() => {
    if (filtredProps) {
      const array = filtredProps?.map(prop => {
        return {
          id: prop._id,
          title: prop.title,
          images: prop.images,
          address: `${prop.location.street} ${prop.location.number}`,
          barrio: listaBarrios.find(
            barrio => barrio.value === prop.location.barrio
          )?.label,
          price: `${
            prop.price?.total ? informacion.currency[prop.price.currency] : ''
          } ${
            prop.price?.total?.toLocaleString('en-US') || 'Sin precio asignado'
          }`,
          operation: `${informacion.operation[prop.operation_type]}`,
          updated_at: dayjs(prop.updated_at).format('DD/MM/YYYY HH:mm [hs]'),
          created_at: dayjs(prop.updated_at).format('DD/MM/YYYY HH:mm [hs]'),
          type: informacion.property[prop.property_type],
          status: propStatusObj[prop.status],
          statistics: prop.statistics,
          actions: (
            <PropActions
              prop={prop}
              userLogged={userLogged}
              checkChanges={checkChanges}
              setCheckChanges={setCheckChanges}
              token={token}
            />
          ),
          rawProp: prop
        };
      });

      setData(array);
    }
  }, [filtredProps]);

  const canNextPage = Math.ceil(totalProps / propsLimit) > page.number;
  const canPreviousPage = page.number > 1;

  const nextPage = () => {
    setPage(prev => ({ number: prev.number + 1 }));
  };

  const previousPage = () => {
    setPage(prev => ({ number: prev.number - 1 }));
  };

  return (
    <>
      {userLogged && branchOffices && (
        <>
          <PageHeader
            title="Mis Publicaciones"
            description="Mantené al día el estado de tus publicaciones, así como sus fotografías y no descuides los mensajes de los interesados."
            className="mb-3 bg-white"
          >
            {userLogged &&
              (userLogged.typeOfUser === 'admin' ||
                HavePermission('Create properties', userLogged)) && (
                <ButtonCreate
                  text="Nueva Publicación"
                  funcion={() => navigate('/propiedades/cargar')}
                  variant="primary"
                />
              )}
          </PageHeader>

          <Row className="g-3">
            <Col xs={12} lg={3} xxl={2}>
              <ListFilterComponent
                filtersAndSort={filtersAndSort}
                setFiltersAndSort={setFiltersAndSort}
                branchOffices={branchOffices}
                branchOffice={branchOffice}
                setBranchOffice={setBranchOffice}
                submitSearch={submitSearch}
                searching={!!searchProp}
              />
            </Col>

            <Col xs={12} lg={9} xxl={10}>
              <Row className="g-1">
                <Col xs={12}>
                  <ListOrderComponent
                    type={type}
                    setType={setType}
                    page={page.number}
                    propsLimit={propsLimit}
                    setPropsLimit={setPropsLimit}
                    totalProps={totalProps}
                    filtersAndSort={filtersAndSort}
                    setFiltersAndSort={setFiltersAndSort}
                  />
                </Col>

                <Col xs={12}>
                  {data &&
                    propsColumns &&
                    (type === 'table' ? (
                      <PropsTable
                        data={data}
                        page={page.number}
                        setPage={setPage}
                        propsLimit={propsLimit}
                        setPropsLimit={setPropsLimit}
                        totalProps={totalProps}
                        columns={propsColumns}
                        filtersAndSort={filtersAndSort}
                        setFiltersAndSort={setFiltersAndSort}
                      />
                    ) : (
                      <PropsCards properties={data} />
                    ))}
                </Col>

                <Col xs={12} className="pt-2">
                  <AdvanceTablePagination
                    canNextPage={canNextPage}
                    canPreviousPage={canPreviousPage}
                    pageCount={Math.ceil(totalProps / propsLimit)}
                    gotoPage={page => setPage({ number: page + 1 })}
                    nextPage={nextPage}
                    pageIndex={page.number - 1}
                    previousPage={previousPage}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ListaPropiedades;
