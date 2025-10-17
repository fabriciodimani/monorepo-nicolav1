import React, { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; //Paquete para decodificar el Token
import { Link, useLocation, useHistory } from "react-router-dom";
// import { getComandas } from "../helpers/rutaComandas";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import logo from "../images/distripollo.jpeg";
import "../css/navbar.css";
import ThemeContext from "../Context/ThemeContext";

const NavBar = () => {
  //Defino location e history
  const location = useLocation();
  const history = useHistory();

  //estado para manejar el usuario
  const [user, setUser] = useState("Iniciar sesión");

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [payload, setPayload] = useState({
    role: "",
  });

  //estado para manejar los datos de los cursos
  // const [comandas, setComandas] = useState({
  //   data: {},
  //   loading: true,
  // });

  //Si cambia la locación asigno a user el valor de localstorage
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("usuario")) || "Iniciar Sesión");
    // ActualizarData();
    checkToken();
  }, [location]);

  //Cuando monto navbar se cargan los cursos
  // useEffect(() => {
  //   ActualizarData();
  //   //  getComandas().then((datos) => {
  //   //    setComandas({
  //   //     data: datos,
  //   //      loading: false,
  //   //    });
  //   //  });
  // }, []);

  // const ActualizarData = () => {
  //   getComandas(0, 100).then((datos) => {
  //     setComandas({
  //       data: datos,
  //       loading: false,
  //     });
  //   });
  // };

  //Manejo el deslogueo de la web
  const handleLogin = () => {
    localStorage.setItem("token", JSON.stringify(""));
    localStorage.setItem("id", JSON.stringify(""));
    localStorage.setItem("usuario", JSON.stringify("Iniciar Sesión"));
    setUser(JSON.parse(localStorage.getItem("usuario")));
    setPayload({ role: "" });
    history.push("/login");
  };

  const checkToken = () => {
    let token = JSON.parse(localStorage.getItem("token")) || "";
    if (token.length > 0) {
      let token_decode = jwt_decode(localStorage.getItem("token")); //Obteniendo los datos del payload
      setPayload(token_decode.usuario);
    }
  };

  return (
    <div>
      <div id="navBar" className="navBar mr-auto">
        <Navbar bg="light" expand="lg">
          <img src={logo} alt="logo" />
          <Link className="nav" to="/">
            <Navbar.Brand>Distri Pollo</Navbar.Brand>
          </Link>

          <Navbar.Toggle id="hamburguesa" aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* <Navbar className="mr-auto"> */}
            <Nav>

            {payload.role === "ADMIN_ROLE" && (
                <NavDropdown title="Preventa" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/comandas"
                    classename="nav-link3"
                  >
                    Generar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/StocksPrev"
                    classename="nav-link3"
                  >
                    Consultar Stock
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformePreventas"
                    classename="nav-link3"
                  >
                    Listar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/ClientesPrev"
                    classename="nav-link3"
                  >
                    Altas Clientes
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {payload.role === "ADMIN_SUP" && (
                <NavDropdown title="Preventa" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/comandas"
                    classename="nav-link3"
                  >
                    Generar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/StocksPrev"
                    classename="nav-link3"
                  >
                    Consultar Stock
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformePreventas"
                    classename="nav-link3"
                  >
                    Listar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/ClientesPrev"
                    classename="nav-link3"
                  >
                    Altas Clientes
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {payload.role === "USER_PREV" && (
                <NavDropdown title="Preventa" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/comandas"
                    classename="nav-link3"
                  >
                    Generar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/StocksPrev"
                    classename="nav-link3"
                  >
                    Consultar Stock
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformePreventas"
                    classename="nav-link3"
                  >
                    Listar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/ClientesPrev"
                    classename="nav-link3"
                  >
                    Altas Clientes
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {payload.role === "USER_CAM" && (
                <Link to="/camiones" className="nav-link ml-3 mt-2">
                  Distribucion
                </Link>
              )}

              {payload.role === "ADMIN_ROLE" && (
                <Link to="/camiones" className="nav-link ml-3 mt-2">
                  Distribucion
                </Link>
              )}
              
              {payload.role === "ADMIN_SUP" && (
                <Link to="/camiones" className="nav-link ml-3 mt-2">
                  Distribucion
                </Link>
              )}

              {payload.role === "USER_CAM" && (
                <Link to="/mapas" className="nav-link ml-3 mt-2">
                  Mapa
                </Link>
              )}

              {payload.role === "ADMIN_ROLE" && (
                <Link to="/remitos" className="nav-link ml-3 mt-2">
                  Remito
                </Link>
              )}

              {payload.role === "USER_STK" && (
                <Link to="/remitos" className="nav-link ml-3 mt-2">
                  Remito
                </Link>
              )}

              {payload.role === "ADMIN_ROLE" && (
                <Link to="/stocks" className="nav-link ml-3 mt-2">
                  Stock
                </Link>
              )}

              {payload.role === "USER_STK" && (
                <Link to="/stocks" className="nav-link ml-3 mt-2">
                  Stock
                </Link>
              )}

              {payload.role === "ADMIN_ROLE" && (
                <Link to="/precios" className="nav-link ml-3 mt-2">
                  Precios
                </Link>
              )}

              {(payload.role === "ADMIN_ROLE" || payload.role === "ADMIN_SUP") && (
                <Link to="/CuentaCorriente" className="nav-link ml-3 mt-2">
                  Cuenta Corriente
                </Link>
              )}

              {(payload.role === "ADMIN_ROLE" || payload.role === "ADMIN_SUP") && (
                <NavDropdown
                  title="Altas"
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item href="/clientes" classename="nav-link3">
                    Clientes
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/proveedores" classename="nav-link3">
                    Proveedores
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/producservs" classename="nav-link3">
                    Productos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/rutas" classename="nav-link3">
                    Rutas
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/rubros" classename="nav-link3">
                    Rubros
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/marcas" classename="nav-link3">
                    Marcas
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/localidades" classename="nav-link3">
                    Localidades
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* {payload.role === "ADMIN_SUP" && (
                <NavDropdown
                  title="Altas"
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item href="/clientes" classename="nav-link3">
                    Clientes
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/proveedores" classename="nav-link3">
                    Proveedores
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/producservs" classename="nav-link3">
                    Productos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/rutas" classename="nav-link3">
                    Rutas
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/rubros" classename="nav-link3">
                    Rubros
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/marcas" classename="nav-link3">
                    Marcas
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/localidades" classename="nav-link3">
                    Localidades
                  </NavDropdown.Item>
                </NavDropdown>
              )} */}

              {payload.role === "ADMIN_ROLE" && (
                <NavDropdown title="Informes" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/InformeComandas"
                    classename="nav-link3"
                  >
                    Listar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformeImpresion"
                    classename="nav-link3"
                  >
                    Impresion Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformeRemitos"
                    classename="nav-link3"
                  >
                    Listar Remitos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/InformeStock" classename="nav-link3">
                    Historico de Stock
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformeOrdenAPreparar"
                    classename="nav-link3"
                  >
                    Ordenes a Preparar
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformeHojaRuta"
                    classename="nav-link3"
                  >
                    Hoja de Ruta
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              
              {payload.role === "USER_STK" && (
                <NavDropdown title="Informes" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/InformeRemitos"
                    classename="nav-link3"
                  >
                    Listar Remitos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/InformeStock" classename="nav-link3">
                    Historico de Stock
                  </NavDropdown.Item>
                 </NavDropdown>
              )}

              {payload.role === "ADMIN_SUP" && (
                <NavDropdown title="Informes" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/InformeComandas"
                    classename="nav-link3"
                  >
                    Listar Comandas
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformeRemitos"
                    classename="nav-link3"
                  >
                    Listar Remitos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/InformeStock" classename="nav-link3">
                    Historico de Stock
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformeOrdenAPreparar"
                    classename="nav-link3"
                  >
                    Ordenes a Preparar
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="/InformeHojaRuta"
                    classename="nav-link3"
                  >
                    Hoja de Ruta
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {payload.role === "ADMIN_ROLE" && (
                <NavDropdown title="Gestion" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/InformeGestion"
                    classename="nav-link3"
                  >
                    Tablero Control
                  </NavDropdown.Item>
              </NavDropdown>
              )}

              {payload.role === "ADMIN_SUP" && (
                <NavDropdown title="Gestion" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    href="/InformeGestion"
                    classename="nav-link3"
                  >
                    Tablero Control
                  </NavDropdown.Item>
              </NavDropdown>
              )}
              
              {payload.role === "ADMIN_ROLE" && (
                <Link to="/quienes" className="nav-link ml-3 mt-2 mr-5">
                  Acerca
                </Link>
              )}
            </Nav>
            <div className="ml-auto d-flex align-items-center">
              {payload.role === "ADMIN_ROLE" && (
                <Link
                  to="/admin"
                  id="user"
                  className="text-decoration-none text-muted ml-5 mr-3 "
                >
                  Administrador
                </Link>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary ml-3 theme-toggle-btn"
                onClick={toggleTheme}
              >
                {theme === "light" ? "Modo claro" : "Modo oscuro"}
              </button>
              <button
                id="booton"
                className="btn btn-outline-info ml-3"
                onClick={handleLogin}
              >
                {user}
              </button>
            </div>
     
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
};

export default NavBar;
