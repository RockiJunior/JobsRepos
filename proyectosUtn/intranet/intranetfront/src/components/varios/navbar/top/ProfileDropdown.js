/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import Avatar from 'components/common/Avatar';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'redux/actions/auth';

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.authReducer);

  const handleLogout = () => {
    navigate('/login');
    dispatch(logout());
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Dropdown navbar={true} as="li">
        <Dropdown.Toggle
          bsPrefix="toggle"
          as={Link}
          to="#!"
          className="p-0 ps-2 nav-link d-flex align-items-end"
        >
          <Avatar name={`${user?.nombre} ${user?.apellido}`} />
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-card  dropdown-menu-end">
          <div className="bg-white rounded-2 py-2 dark__bg-1000">
            {/* <Dropdown.Item onClick={() => {}}>Perfil</Dropdown.Item> */}
            <Dropdown.Item onClick={() => setOpenModal(true)}>
              Cerrar sesión
            </Dropdown.Item>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        contentClassName="border"
        centered
      >
        <Modal.Header
          closeButton
          className="bg-light px-card border-bottom-0 d-flex align-items-start"
        >
          <Modal.Title as="h5">
            ¿Estás seguro que deseas cerrar sesión?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Button
              size="sm"
              variant="success"
              className="me-1"
              onClick={handleLogout}
            >
              <span>Si</span>
            </Button>
            <Button
              className="ms-1"
              size="sm"
              variant="danger"
              onClick={() => setOpenModal(false)}
            >
              <span>No</span>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

ProfileDropdown.propTypes = {
  admin: PropTypes.object,
  socket: PropTypes.object
};

export default ProfileDropdown;
