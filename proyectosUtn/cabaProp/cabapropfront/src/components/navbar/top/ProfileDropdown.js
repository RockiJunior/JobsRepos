/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Avatar from 'components/common/Avatar';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { logOut } from 'redux/loginSlice';
import { useSelector } from 'react-redux';

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut(navigate));
  };

  const userLogged = useSelector(state => state.login.currentUser);

  return (
    <Dropdown autoClose="outside" align="end" navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className="p-0 ps-2 nav-link d-flex align-items-end"
      >
        <Avatar name={userLogged?.firstName + ' ' + userLogged?.lastName} />
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="bg-light mt-1"
        style={{ boxShadow: '0.5px 0.5px 2px 0px rgba(0, 0, 0, 0.5)' }}
      >
        <Dropdown.Header>{`¡Bienvenido, ${userLogged?.firstName}!`}</Dropdown.Header>
        <Dropdown.Item>
          <Link to="/perfil">Mi perfil</Link>
        </Dropdown.Item>
        <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

ProfileDropdown.propTypes = {
  admin: PropTypes.object,
  socket: PropTypes.object
};

export default ProfileDropdown;
