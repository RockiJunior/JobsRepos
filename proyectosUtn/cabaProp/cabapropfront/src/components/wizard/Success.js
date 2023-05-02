import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { AuthWizardContext } from 'context/Context';
import { useNavigate } from 'react-router-dom';
import { changeStatus, setPropActive } from 'redux/propsSlice';
import { useDispatch } from 'react-redux';
import messageHandler from 'utils/messageHandler';

const Success = ({ data, setData, status, id }) => {
  const { setStep, setUser } = useContext(AuthWizardContext);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const SaveInfo = () => {
    navigate("/propiedades")
    messageHandler("success", "Propiedad guardada con éxito")
    setData({
      branch_office: 0,
      operation_type: 0,
      property_type: 0,
      title: "",
      location: {
          street: "",
          number: "",
          floor: 0,
          apartment: ""
      },
      characteristics: {
          ambience: 0,
          bedrooms: 0,
          bathrooms: 0,
          toilettes: 0,
          garages: 0,
          floors: 0,
          laundries: 0,
          porch: 0,
          covered: false,
          lift: false,
          underground: false,
          building: false
      },
      surface: {
          totalSurface: 0,
          coveredSurface: 0
      },
      antiquity: {
        type: "1",
        years: 0
      },
      price: {
          currency: 1,
          total: 0,
          expenses: 0
      },
      description: "",
      images: [],
      video: ""      
    })
  }

  const PublishProperty = () => {
    dispatch(changeStatus(id, "published"))
    navigate("/propiedades")
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <>
      <Row>
        <Col className="text-center">
          <div className="wizard-lottie-wrapper">
            <div className="wizard-lottie mx-auto">
       </div>
          </div>
          <h4 className="mb-3">La publicación fue {status === "crear" ? "creada" : "modificada"} exitosamente</h4>
        </Col>
          { data.status !== 'published' ? 
            <Button variant='primary' style={{maxWidth: '70', margin: 'auto'}} className="px-5 my-1" onClick={PublishProperty}>
              Publicar propiedad
            </Button>
            :
            <Button variant='primary' disabled style={{maxWidth: '70', margin: 'auto'}} className="px-5 my-1" onClick={PublishProperty}>
              Publicar propiedad
            </Button>
          }
          <Button variant='warning' style={{maxWidth: '70', margin: 'auto'}} className="px-5 my-1" onClick={SaveInfo}>
            Guardar y salir
          </Button>
      </Row>
    </>
  );
};

Success.propTypes = {
  reset: PropTypes.func.isRequired
};

export default Success;
