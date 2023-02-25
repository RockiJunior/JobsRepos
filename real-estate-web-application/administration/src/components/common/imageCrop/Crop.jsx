import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Form, Modal, Spinner, Row, Col } from 'react-bootstrap';
import getCroppedImg from './cropImage';

// eslint-disable-next-line react/prop-types
const Crop = ({ image, setCropImage, setCreated, type }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cropping, setCropping] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const setImage = useCallback(async () => {
    try {
      setCropping(true);
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      setCropImage(croppedImage);
      setCreated(null);
    } catch (e) {
      console.error(e);
    }
    setCropping(false);
  }, [croppedAreaPixels, rotation]);

  const handleZoom = event => {
    setZoom(event.target.value);
  };

  const handleRotation = event => {
    setRotation(event.target.value);
  };

  const handleCancel = () => {
    setCropImage(null);
    setCreated(null);
    setCropping(false);
    const avatarInput = document.getElementById('uploadAvatar');
    const coverInput = document.getElementById('uploadCover');
    if (avatarInput) avatarInput.value = '';
    if (coverInput) coverInput.value = '';
  };

  return (
    <Modal keyboard={true} show={image} size="md" centered>
      <Modal.Body>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Cropper
            image={image}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={type === 'avatar' ? 1 : 4 / 3}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onMediaLoaded={() => setLoading(false)}
          />
          {loading && (
            <center>
              <Spinner variant="primary" animation="border" className="m-4" />
            </center>
          )}
        </div>
        <div
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          <div style={{ display: 'flex', flex: '1', alignItems: 'center' }}>
            <Form.Label>Zoom</Form.Label>
            <Form.Range
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={handleZoom}
              style={{ padding: '22px 0px', marginLeft: 32 }}
            />
          </div>
          <div style={{ display: 'flex', flex: '1', alignItems: 'center' }}>
            <Form.Label>Rotation</Form.Label>
            <Form.Range
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-label="Rotation"
              onChange={handleRotation}
              style={{ padding: '22px 0px', marginLeft: 32 }}
            />
          </div>
          <Row>
            <Col>
              <Button
                onClick={setImage}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  width: '100%'
                }}
              >
                Guardar
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '100%',
                    position: 'absolute'
                  }}
                >
                  <Spinner
                    size="sm"
                    variant="dark"
                    animation="border"
                    className="m-2"
                    style={{ opacity: cropping ? 1 : 0 }}
                  />
                </div>
              </Button>
            </Col>
            <Col>
              <Button style={{ width: '100%' }} onClick={handleCancel}>
                Cancelar
              </Button>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Crop;
