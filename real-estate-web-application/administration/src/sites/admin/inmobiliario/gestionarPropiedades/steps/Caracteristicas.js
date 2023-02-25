import React, { useState } from 'react'
import { Button, Dropdown, DropdownButton, Form, FormControl, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './styles.css'

const Caracteristicas = () => {
  const navigate = useNavigate()
  const [info, setInfo] = useState({
    caracteristicas: {
      ambientes: 0,
      dormitorios: 0,
      banios: 0,
      toilettes: 0,
      cocheras: 0,
    },
    superficie: {
      supTotal: 0,
      supCubierta: 0,
    },
    antiguedad: 1,
    precio: {
      unidad: "ARS",
      total: 0,
      totalExpensas: 0
    },
    descripcion: {
      titulo: "",
      desc: ""
    }
  })

  //handlers
  const handleChangeCarac = (e, value, action) => {
    e.preventDefault()
    setInfo({
      ...info,
      caracteristicas: {
        ...info.caracteristicas,
        [value]: action === "add" ? info.caracteristicas[value] + 1 :
          info.caracteristicas[value] > 0 ? info.caracteristicas[value] - 1 : 0
      }
    })
  }

  const checkSurface = () => {
    
  }

  const handleRadio = e => {
    setInfo({
        ...info,
        antiguedad: e.target.value
    })
}

  return (
    <>
      <p className='fw-bold'>Caracteristicas principales</p>
      <div className='d-flex pb-3'>
        <div className='me-7 text-center'>
          <span>Ambientes</span>
          <div className='caracteristicas__box'>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm"
              onClick={(e) => handleChangeCarac(e, "ambientes", "rest")}>
              -
            </Button>
            <span className='caracteristicas__quantity'>{info.caracteristicas.ambientes}</span>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm" onClick={(e) => handleChangeCarac(e, "ambientes", "add")}>
              +
            </Button>
          </div>
        </div>
        <div>
          <span>Dormitorios</span>
          <div className='caracteristicas__box'>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm" onClick={(e) => handleChangeCarac(e, "dormitorios", "rest")}>
              -
            </Button>
            <span className='caracteristicas__quantity'>{info.caracteristicas.dormitorios}</span>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm" onClick={(e) => handleChangeCarac(e, "dormitorios", "add")}>
              +
            </Button>
          </div>
        </div>
      </div>

      <div className='d-flex pb-3'>
        <div className='me-7 text-center'>
          <span>Baños</span>
          <div className='caracteristicas__box'>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm"
              onClick={(e) => handleChangeCarac(e, "banios", "rest")}>
              -
            </Button>
            <span className='caracteristicas__quantity'>{info.caracteristicas.banios}</span>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm" onClick={(e) => handleChangeCarac(e, "banios", "add")}>
              +
            </Button>
          </div>
        </div>
        <div className='text-center'>
          <span>Toilettes</span>
          <div className='caracteristicas__box'>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm" onClick={(e) => handleChangeCarac(e, "toilettes", "rest")}>
              -
            </Button>
            <span className='caracteristicas__quantity'>{info.caracteristicas.toilettes}</span>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm" onClick={(e) => handleChangeCarac(e, "toilettes", "add")}>
              +
            </Button>
          </div>
        </div>
      </div>

      <div className='d-flex pb-5'>
        <div className='text-center'>
          <span>Cocheras</span>
          <div className='caracteristicas__box'>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm"
              onClick={(e) => handleChangeCarac(e, "cocheras", "rest")}>
              -
            </Button>
            <span className='caracteristicas__quantity'>{info.caracteristicas.cocheras}</span>
            <Button variant="falcon-default" className="rounded-pill me-1 mb-1"
              size="sm" onClick={(e) => handleChangeCarac(e, "cocheras", "add")}>
              +
            </Button>
          </div>
        </div>
      </div>

      <div className='pb-5'>
        <p className='fw-bold'>Superficie</p>
        <div className='d-flex'>
          <div className='me-5'>
            <p>Superficie total</p>
            <InputGroup style={{ width: 120 }}
            >
              <InputGroup.Text id="basic-addon1">m2</InputGroup.Text>
              <FormControl onBlur={checkSurface}
                placeholder="0"
                aria-label="supTotal"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
          <div>
            <p>Superficie cubierta</p>
            <InputGroup style={{ width: 120 }}
            >
              <InputGroup.Text id="basic-addon1">m2</InputGroup.Text>
              <FormControl
                placeholder="0"
                aria-label="supCubierta"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
        </div>
      </div>

      <div className='pb-5'>
        <p className='fw-bold'>Antigüedad</p>
        <Form.Check
          type='radio'
          id='antiguedad1'
          label='A estrenar'
          name='radio'
          value={1}
          onClick={handleRadio}
          defaultChecked
        />
        <div className='d-flex align-items-center'>
          <Form.Check
            type='radio'
            id='antiguedad2'
            label='Años de antigüedad'
            name='radio'
            value={2}
            onClick={handleRadio}
          />
          {
            info.antiguedad === "2" && (
              <input type="" name="" value="" placeholder='0'
                style={{ marginTop: '-5px', marginLeft: 10, border: 'none', width: 60 }} />
            )
          }
        </div>
        <Form.Check
          type='radio'
          id='antiguedad3'
          label='En construcción'
          name='radio'
          value={3}
          onClick={handleRadio}
        />
      </div>

      <div>
        <p className='fw-bold'>Precio</p>
        <div>
          <p>Precio de la propiedad</p>
          <InputGroup style={{ width: 200 }}>
            <DropdownButton
              variant="outline-secondary"
              title="USD"
              id="input-group-dropdown-1"
            >
              <Dropdown.Item href="#">USD</Dropdown.Item>
              <Dropdown.Item href="#">$</Dropdown.Item>
            </DropdownButton>
            <FormControl aria-label="Text input with dropdown button" />
          </InputGroup>
        </div>
        <div>
          <p>Expensas (opcional)</p>
          <InputGroup style={{ width: 200 }}
          >
            <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
            <FormControl
              placeholder="0"
              aria-label="precio"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </div>
      </div>
    </>
  )
}

export default Caracteristicas