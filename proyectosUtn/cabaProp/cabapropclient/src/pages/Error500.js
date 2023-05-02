import ImgError500 from "../assets/img/error500.png";
import { Link } from "react-router-dom";

const Error500 = () => {
  return (
    <>
      <div className="container">
        <div className="error-404-container ">
          <img src={ImgError500} className="error-404" alt="500" />
          <h2 className="error-404 mt-2 text-center ">
            Parece que hubo un error interno. <br /> Por favor, intentá de nuevo
            más tarde.
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

export default Error500;
