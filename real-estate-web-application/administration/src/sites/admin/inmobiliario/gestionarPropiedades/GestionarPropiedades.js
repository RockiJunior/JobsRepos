import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListaPropiedades from './tables/ListaPropiedades';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useSelector } from 'react-redux';
import { getPropsByBranchOffice } from 'redux/propsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GestionarPropiedades = () => {
  const dispatch = useDispatch()
  const token = localStorage.getItem("token")
  const props = useSelector((state) => state.props.branchOfficeProps)
  const [checkChanges, setCheckChanges] = useState(false)
  const userLogged = useSelector((state) => state.login.currentUser)
  //Permisos
  const rolesUser = useSelector(state => state.roles.rolesById)
  const permisos = []

  if (userLogged?.typeOfUser!== 'admin') {
    userLogged?.roles.map((roles) => rolesUser[roles.id]?.roleToPermission.map((permiso) => permisos.indexOf(permiso.permission.id) === -1 && permisos.push(permiso.permission.id)))
  }
  const officesArray = userLogged?.typeOfUser!== 'admin' ? userLogged?.branchOffices : userLogged?.realEstate.branchOffice
  //Get props
  useEffect(() => {
    dispatch(getPropsByBranchOffice(officesArray, token))
  }, [userLogged, checkChanges, officesArray])
  
  return (
    <div className='ms-4'>
      <FalconComponentCard>
        <FalconComponentCard.Body>
          <div className='d-flex w-100 align-items-center justify-content-between px-3 mt-4 mb-7'>
            <h4 className='m-0'>
              <FontAwesomeIcon icon='fa-building' className='text-primary' style={{ marginRight: 10}} />
              Gestionar propiedades
            </h4>
            <Breadcrumb>
              <Breadcrumb.Item href="#" active>
                Gestionar propiedades
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <ListaPropiedades properties={props} branchOffices={officesArray} checkChanges={checkChanges} setCheckChanges={setCheckChanges} />
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </div>
  )
}

export default GestionarPropiedades