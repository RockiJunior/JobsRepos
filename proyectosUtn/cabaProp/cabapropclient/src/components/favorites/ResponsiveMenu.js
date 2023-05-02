import { Link } from "react-router-dom";

const ResponsiveMenu = ({ item }) => {
  const ToggleDropdown = () =>
    document.getElementById("myDropdown").classList.toggle("show");

  return (
    <div className="dashboard_navigationbar dn db-lg">
      <div className="dropdown">
        <button onClick={ToggleDropdown} className="dropbtn">
          <i className="fa fa-bars pr10"></i> Menú de navegación
        </button>
        <ul id="myDropdown" className="dropdown-content">
          <li>
            <Link to="/mi-perfil" className={item === 1 ? "active" : ""}>
              <span className="flaticon-user"></span> Mi Perfil
            </Link>
          </li>
          <li>
            <Link to="/favoritos" className={item === 2 ? "active" : ""}>
              <span className="flaticon-heart-shape-outline"></span> Favoritos
            </Link>
          </li>
          <li>
            <Link
              to="/busquedas-guardadas"
              className={item === 3 ? "active" : ""}
            >
              <span className="flaticon-magnifiying-glass"></span> Búsquedas
              Guardadas
            </Link>
          </li>
          <li>
            <Link to="/mensajes" className={item === 4 ? "active" : ""}>
              <span className="flaticon-mail-inbox-app"></span> Mensajes
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
