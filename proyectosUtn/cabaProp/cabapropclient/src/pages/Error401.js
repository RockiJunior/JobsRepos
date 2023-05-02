import ImgError401 from "../assets/img/error401.png";
import { Link } from "react-router-dom";

const Error401 = () => {
  return (
    <>
      <div className="container">
        <div className="error-404-container">
          <img src={ImgError401} className="error-404" alt="401" />
          <h2 className="error-404 mt-2 text-center">
            No estás autorizado para entrar acá. <br /> Por favor, iniciá sesión
            y volvé a intentarlo.
          </h2>
          <Link
            to="/"
            className="btn btn-thm mt-4 py-2 px-3"
            style={{ width: "fit-content" }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
};

export default Error401;
