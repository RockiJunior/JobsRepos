import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import moment from 'moment'
moment.locale('es')
import 'moment/locale/es'
import { useDispatch } from 'react-redux';
import { propsColumns, informacion } from '../mockup/props';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../modals/DeleteModal';
import { changeStatus, deleteProp } from 'redux/propsSlice';
import PropsTable from 'components/common/propsTable/PropsTable';
import ButtonEdit from 'utils/buttonEdit';
import ButtonDelete from 'utils/buttonDelete';
import ButtonPause from 'utils/buttonPause';
import ButtonActive from 'utils/buttonActive';
import ButtonFinish from 'utils/buttonFinish';
import PauseModal from '../modals/PauseModal';
import FinishModal from '../modals/FinishModal';
import ActiveModal from '../modals/ActiveModal';
import ButtonCreate from 'utils/buttonCreate';
import { Form } from 'react-bootstrap';

const ListaPropiedades = ({ properties, branchOffices, checkChanges, setCheckChanges }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  //filtrado y sort de propiedades mostradas
  const token = localStorage.getItem("token")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterOperation, setFilterOperation] = useState("all")
  const [filtredProps, setFiltredProps] = useState(properties[branchOffice])
  const [searchProp, setSearchProp] = useState("");
  const [includesFinished, setIncludesFinished] = useState(false)
  const [branchOffice, setBranchOffice] = useState(0)
  const [sortedProps, setSortedProps] = useState(properties[branchOffice])
  const [data, setData] = useState()
  const [deleteModal, setDeleteModal] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [propSelected, setPropSelected] = useState({})

  //seteo la sucursal actual
  useEffect(() => {
    setBranchOffice(branchOffices && branchOffices[0]?.id)
  }, [branchOffices])

  //inicializo las dos listas de propiedades en base a la lista actual
  useEffect(() => {
    setSortedProps(properties[branchOffice])
  }, [properties])

  //seteo la lista al haber un cambio de sucursal
  useEffect(() => {
    setSortedProps(properties[branchOffice])
  }, [branchOffice])

  /* //ordeno la lista en base al orden actual aplicado (default recientes)
  useEffect(() => {
      setSortedProps([...sortedProps]?.sort((a, b) => a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0))
      setRender(render + 1)
  }, [checkChanges]) */

  //checkeo los filtros actuales sobre la lista ordenada para setear la lista de props
  useEffect(() => {
    if (sortedProps && sortedProps.length > 0) {
      let cleanList = sortedProps
      if (filterStatus !== 'all') {
        cleanList = cleanList.filter((prop) => prop.status === filterStatus)
      } else if (includesFinished) {
        cleanList = cleanList.filter((prop) => prop.status !== 'deleted')
      } else {
        cleanList = cleanList.filter((prop) => prop.status !== 'finished')
      }
      if (filterType !== 'all') {
        cleanList = cleanList.filter((prop) => prop.property_type === parseInt(filterType))
      }
      if (filterOperation !== 'all') {
        cleanList = cleanList.filter((prop) => prop.operation_type === parseInt(filterOperation))
      }
      if (searchProp !== '') {
        const searchList = cleanList.filter((prop) => {
          const address = prop.location.street.toLowerCase()
          return address.includes(searchProp.toLowerCase())
        })
        setFiltredProps(searchList)
      } else {
        setFiltredProps(cleanList)
      }
    }
  }, [filterStatus, branchOffice, filterType, filterOperation, searchProp, sortedProps, checkChanges, includesFinished])

  //Functions
  const handleSearch = (e) => {
    setSearchProp(e.target.value)
  };

  const handleStatus = async (data) => {
    let status = data.status
    let id = data.id
    if (status === 'deleted') {
      const response = await dispatch(deleteProp(id, token))
      response < 400 && setCheckChanges(!checkChanges)
    } else {
      const response = await dispatch(changeStatus(id, status, token))
      response < 400 && setCheckChanges(!checkChanges)
    }
  }

  const handleEditButton = (id) => {
    navigate(`/propiedades/editar/${id}`)
  }

  const handleDeleteButton = (prop) => {
    setPropSelected(prop)
    setDeleteModal(true)
  }

  const handlePauseButton = (prop) => {
    setPropSelected(prop)
    setPauseModal(true)
  }

  const handleFinishButton = (prop) => {
    setPropSelected(prop)
    setFinishModal(true)
  }

  const handleActiveButton = (prop) => {
    setPropSelected(prop)
    setActiveModal(true)
  }

  useEffect(() => {
    if (filtredProps) {
      const array = filtredProps?.map((prop) => {
        const date = new Date(prop.updated_at)
        return (
          {
            address: `${prop.location.street} ${prop.location.number}`,
            price: `${prop.price ? prop.price.total ? informacion.currency[prop.price.currency] : '' : ''} ${prop.price ? prop.price.total ? (prop.price.total).toLocaleString("en-US") : 'Sin precio asignado' : 'Sin precio asignado'}`,
            operation: `${informacion.operation[prop.operation_type]}`,
            updated_at: `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
            type: `${informacion.property[prop.property_type]}`,
            status: `${prop.status === 'pending' ? 'Pendiente'
              : prop.status === 'published' ? 'Activa'
                : prop.status === 'paused' ? 'Pausada'
                  : prop.status === 'deleted' ? 'Eliminada' : 'Finalizada'}`,
            actions: [
              prop.status !== 'finished' && ButtonEdit(handleEditButton, prop._id),
              prop.status === 'published' && ButtonPause(handlePauseButton, prop),
              prop.status === 'paused' && ButtonActive(handleActiveButton, prop),
              prop.status !== 'finished' && ButtonDelete(handleDeleteButton, prop),
              (prop.status === 'published' || prop.status === 'paused') && ButtonFinish(handleFinishButton, prop)]
          })
      })
      setData(array)
    }
  }, [filtredProps])

  return (
    <>
      <div className='d-flex flex-row align-items-center justify-content-between align-text-center mb-4 w-100 px-3' >
        <div className='d-flex align-items-center align-text-center'>
          <FontAwesomeIcon icon='fa-solid fa-list' className='text-dark' style={{ marginRight: 10, fontSize: 20 }} />
          <h5 className='text-start m-0'>Lista de propiedades</h5>
        </div>
        {ButtonCreate('Cargar una propiedad', () => navigate('/propiedades/cargar'))}
      </div>
      <div className='my-3'>
        <div className="mt-2 mb-3 ms-3 d-flex justify-content-start align-items-end" style={{ gap: 10 }}>
          <div>
            <label>Sucursal seleccionada:</label>
            <select style={{ maxWidth: 250 }} className="form-select form-select-sm" aria-label="Default select example"
              onChange={(e) => setBranchOffice(e.target.value)}
            >
              {branchOffices?.map((office, index) => {
                return (
                  <option key={index} value={office?.id}>{office?.branch_office_name}</option>)
              }
              )}
            </select>
          </div>
          <div>
            <label>Filtrar por operacion:</label>
            <select
              style={{ maxWidth: 250 }}
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => setFilterOperation(e.target.value)}
              defaultValue={filterOperation}
            >
              <option value={"all"}>Todos</option>
              <option value={1}>Ventas</option>
              <option value={2}>Alquileres</option>
              <option value={3}>Temporarios</option>
            </select>
          </div>
          <div>
            <label>Filtrar por propiedad:</label>
            <select
              style={{ maxWidth: 250 }}
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => setFilterType(e.target.value)}
              defaultValue={filterType}
            >
              <option value={"all"}>Todos</option>
              <option value={1}>Departamento</option>
              <option value={2}>Casa</option>
              <option value={3}>PH</option>
              <option value={4}>Cochera</option>
              <option value={5}>Consultorio</option>
              <option value={6}>Fondo de comercio</option>
              <option value={7}>Local</option>
              <option value={8}>Bodega</option>
              <option value={9}>Terreno</option>
            </select>
          </div>
          <div>
            <label>Filtrar por estado:</label>
            <select
              style={{ maxWidth: 250 }}
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => setFilterStatus(e.target.value)}
              defaultValue={filterStatus}
            >
              <option value={"all"}>Todos</option>
              <option value={"published"}>Activas</option>
              <option value={"pending"}>Pendientes</option>
              <option value={"paused"}>Pausadas</option>
              <option value={"finished"}>Finalizadas</option>
            </select>
          </div>
          {filterStatus === "all" &&
            <div className="d-flex flex-row align-items-center" style={{ maxWidth: 200 }}>
              <Form.Check onChange={(e) => setIncludesFinished(e.target.checked)} className='me-1' /><label className="m-0">Incluir finalizadas</label>
            </div>
          }
        </div>
        <div className='ms-3 mb-3' style={{ maxWidth: 250 }} >
          <input
            type="text"
            className="form-control form-control-sm"
            required
            id="address"
            aria-describedby="lastnameHelp"
            placeholder="Buscar propiedad"
            value={searchProp}
            onChange={(e) => {
              handleSearch(e)
            }}
          />
        </div>
      </div>
      {(data && propsColumns) &&
        <PropsTable
          columns={propsColumns}
          data={data}
        />}
      {
        deleteModal && (
          <DeleteModal setShow={setDeleteModal} property={propSelected} handleStatus={handleStatus} />
        )
      }
      {
        pauseModal && (
          <PauseModal setShow={setPauseModal} property={propSelected} handleStatus={handleStatus} />
        )
      }
      {
        finishModal && (
          <FinishModal setShow={setFinishModal} property={propSelected} handleStatus={handleStatus} />
        )
      }
      {
        activeModal && (
          <ActiveModal setShow={setActiveModal} property={propSelected} handleStatus={handleStatus} />
        )
      }
    </>
  );
}

export default ListaPropiedades