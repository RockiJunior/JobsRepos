import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/loginSlice";
import Modal from "react-responsive-modal";
import RegisterForm from "./header/RegisterForm";
import LoginForm from "./header/LoginForm";
import MobileHeader from "./header/MobileHeader";
import Container from "./header/Container";

const Header = ({userLogged}) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const [tabs, setTabs] = useState(1);

  //handlers
  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <>
      <Container setShowModal={setShowModal} userLogged={userLogged} />
      <div
        className="sign_up_modal modal fade"
        id="logInModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body container pb30 pl0 pr0 pt0">
              <div className="row">
                <div className="col-lg-12">
                  <ul
                    className="sign_up_tab nav nav-tabs"
                  >
                    <li className="nav-item" onClick={() => setTabs(1)}>
                      <a
                        className={`nav-link cursor-pointer ${tabs === 1 && "active"}`}
                      >
                        Iniciar Sesión
                      </a>
                    </li>
                    <li className="nav-item" onClick={() => setTabs(2)}>
                      <a
                        className={`nav-link cursor-pointer ${tabs === 2 && "active"}`}
                      >
                        Registrarme
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tab-content container">
                {tabs === 1 ? (
                  <LoginForm />
                ) : (
                  <RegisterForm setTabs={setTabs} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileHeader />
      <Modal open={showModal} onClose={() => setShowModal(false)} center>
        <div className="modal-header">
          <h4 className="modal-title">¿Seguro que quieres cerrar sesión?</h4>
        </div>
        <div className="modal-body d-flex">
          <button className="btn w-50 m-1 btn-success" onClick={handleLogout}>
            Confirmar
          </button>
          <button
            className="btn btn-danger w-50 m-1"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Header;
