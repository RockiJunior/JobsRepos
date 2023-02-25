import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import WizardInput from './WizardInput';
import FalconDropzone from 'components/common/FalconDropzone';
import avatarImg from 'assets/img/team/avatar.png';
import { isIterableArray } from 'helpers/utils';
import Avatar from 'components/common/Avatar';
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import { AuthWizardContext } from 'context/Context';
import Flex from 'components/common/Flex';
import { Col, Image, Row } from 'react-bootstrap';

const PersonalForm = ({ register, errors, setValue }) => {
  const { user } = useContext(AuthWizardContext);
  const [avatar, setAvatar] = useState([
    ...(user.avater ? user.avater : []),
    { src: avatarImg }
  ]);

  return (
    <>
      <Row className="mb-3">
        <Col md>
          <FalconDropzone
            files={avatar}
            onChange={files => {
              setAvatar(files);
              setValue('avatar', files);
            }}
            multiple={false}
            accept="image/*"
            placeholder={
              <>
                <Flex justifyContent="center">
                  <img src={cloudUpload} alt="" width={25} className="me-2" />
                  <p className="fs-0 mb-0 text-700">
                    Cargar imágenes
                  </p>
                </Flex>
                <p className="mb-0 w-75 mx-auto text-400">
                  Sube imágenes 300x300 jpg con un tamaño máximo de 400KB
                </p>
              </>
            }
          />
        </Col>
      </Row>
      <Row>
      <Col md="auto">
          <Image
            size="sm"
            src={
              isIterableArray(avatar) ? avatar[0]?.base64 || avatar[0]?.src : ''
            }
          />
        </Col>
      </Row>
    </>
  );
};

PersonalForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  setValue: PropTypes.func.isRequired
};

export default PersonalForm;
