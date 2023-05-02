import ImgError404 from "../assets/img/error404.png";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <>
      <div className="container">
        <div className="error-404-container">
          <img src={ImgError404} className="error-404" alt="404" />
          <h2 className="error-404 mt-2 text-center">
            Parece que la página que estás buscando no existe.
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

export default Error404;
