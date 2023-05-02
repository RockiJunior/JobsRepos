import React from 'react'
import { Card } from 'react-bootstrap'
import Permiso from './Permiso'

const Permisos = ({ rol, name, permissions, handleSwitch }) => {
  return (
/*     <div className='mb-5 me-5 d-flex flex-column align-items-center' style={{ width: 260 }}>
 */      <Card className='mb-5 me-5 d-flex flex-column align-items-center' style={{ width: 260 }}>
        <label className='text-center my-3'>{name}</label>
        {permissions.map((permiso, index) => {
          return (
            <Permiso
              key={index}
              rol={rol}
              permiso={permiso}
              handleSwitch={handleSwitch}
            />
          )
        })}
      </Card>
/*     </div>
 */  )
}

export default Permisos