import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/loginSlice";
import { Modal } from "react-responsive-modal";

const CounterModal = () => {
  // * States
  const [seconds, setSeconds] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [intervalID, setIntervalID] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.login.currentUser);

  // * Methods
  const StartCountdown = () => {
    const id = setInterval(() => {
      setCountdown((countdown) => countdown + 1);
    }, 1000);
    setIntervalID(id);
  };

  const ResetCounter = () => {
    setShowModal(false);
    setSeconds(0);
    setCountdown(0);
    clearInterval(intervalID);
    setIntervalID(null);
  };

  const LogOut = () => {
    ResetCounter();
    dispatch(logOut());
  };

  // * Life Cycle
  useEffect(() => {
    if (userLogged) {
      const intervalId = setInterval(() => {
        setSeconds((seconds) => seconds + 60);
      }, 60000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line
  }, [userLogged]);

  useEffect(() => {
    if (seconds === 1800) {
      setShowModal(true);
      StartCountdown();
    }
    // eslint-disable-next-line
  }, [seconds]);

  useEffect(() => {
    if (30 - countdown === 0) LogOut();
    // eslint-disable-next-line
  }, [countdown]);

  useEffect(() => {
    if (!showModal) {
      document.addEventListener("click", ResetCounter);
      document.addEventListener("mousemove", ResetCounter);
    } else {
      document.removeEventListener("click", ResetCounter);
      document.removeEventListener("mousemove", ResetCounter);
    }
    return () => {
      document.removeEventListener("click", ResetCounter);
      document.removeEventListener("mousemove", ResetCounter);
    };
    // eslint-disable-next-line
  }, [showModal]);

  return (
    <>
      <Modal open={showModal} closeIcon center>
        <div className="modal-header d-flex flex-column">
          <h4 className="modal-title">Inactividad detectada</h4>
          <h5>
            {`Confirmá que estás activo o tu sesión va a cerrarse en ${
              30 - countdown
            } segundos`}
          </h5>
        </div>
        <div className="modal-body">
          <button className="btn m-1 btn-success" onClick={ResetCounter}>
            Confirmar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CounterModal;
