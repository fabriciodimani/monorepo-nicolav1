import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; //Paquete para decodificar el Token
import { Link, useLocation, useHistory } from "react-router-dom";
// import { getComandas } from "../helpers/rutaComandas";
import { Navbar, Nav, NavDropdown, Offcanvas, Button } from "react-bootstrap";
import logo from "../images/distripollo.jpeg";
import "../css/navbar.css";

export const NAVBAR_LAYOUTS = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
};

const NavLinks = ({ payload, onNavigate }) => (
  <>
    {(payload.role === "ADMIN_ROLE" || payload.role === "ADMIN_SUP" ||
      payload.role === "USER_PREV") && (
      <NavDropdown title="Preventa" id="navbarScrollingDropdown">
        <NavDropdown.Item
          href="/comandas"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Generar Comandas
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/StocksPrev"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Consultar Stock
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/InformePreventas"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Listar Comandas
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/ClientesPrev"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Altas Clientes
        </NavDropdown.Item>
      </NavDropdown>
    )}

    {(payload.role === "USER_CAM" ||
      payload.role === "ADMIN_ROLE" ||
      payload.role === "ADMIN_SUP") && (
      <Link
        to="/camiones"
        className="nav-link ml-3 mt-2"
        onClick={onNavigate}
      >
        Distribucion
      </Link>
    )}

    {payload.role === "USER_CAM" && (
      <Link to="/mapas" className="nav-link ml-3 mt-2" onClick={onNavigate}>
        Mapa
      </Link>
    )}

    {(payload.role === "ADMIN_ROLE" || payload.role === "USER_STK") && (
      <Link to="/remitos" className="nav-link ml-3 mt-2" onClick={onNavigate}>
        Remito
      </Link>
    )}

    {(payload.role === "ADMIN_ROLE" || payload.role === "USER_STK") && (
      <Link to="/stocks" className="nav-link ml-3 mt-2" onClick={onNavigate}>
        Stock
      </Link>
    )}

    {payload.role === "ADMIN_ROLE" && (
      <Link to="/precios" className="nav-link ml-3 mt-2" onClick={onNavigate}>
        Precios
      </Link>
    )}

    {(payload.role === "ADMIN_ROLE" || payload.role === "ADMIN_SUP") && (
      <NavDropdown title="Altas" id="navbarScrollingDropdown">
        <NavDropdown.Item
          href="/clientes"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Clientes
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/proveedores"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Proveedores
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/producservs"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Productos
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/rutas"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Rutas
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/rubros"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Rubros
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/marcas"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Marcas
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/localidades"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Localidades
        </NavDropdown.Item>
      </NavDropdown>
    )}

    {(payload.role === "ADMIN_ROLE" ||
      payload.role === "USER_STK" ||
      payload.role === "ADMIN_SUP") && (
      <NavDropdown title="Informes" id="navbarScrollingDropdown">
        {(payload.role === "ADMIN_ROLE" || payload.role === "ADMIN_SUP") && (
          <NavDropdown.Item
            href="/InformeComandas"
            classename="nav-link3"
            onClick={onNavigate}
          >
            Listar Comandas
          </NavDropdown.Item>
        )}
        {payload.role === "ADMIN_ROLE" && (
          <NavDropdown.Item
            href="/InformeImpresion"
            classename="nav-link3"
            onClick={onNavigate}
          >
            Impresion Comandas
          </NavDropdown.Item>
        )}
        <NavDropdown.Item
          href="/InformeRemitos"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Listar Remitos
        </NavDropdown.Item>
        <NavDropdown.Item
          href="/InformeStock"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Historico de Stock
        </NavDropdown.Item>
        {(payload.role === "ADMIN_ROLE" || payload.role === "ADMIN_SUP") && (
          <>
            <NavDropdown.Item
              href="/InformeOrdenAPreparar"
              classename="nav-link3"
              onClick={onNavigate}
            >
              Ordenes a Preparar
            </NavDropdown.Item>
            <NavDropdown.Item
              href="/InformeHojaRuta"
              classename="nav-link3"
              onClick={onNavigate}
            >
              Hoja de Ruta
            </NavDropdown.Item>
          </>
        )}
      </NavDropdown>
    )}

    {(payload.role === "ADMIN_ROLE" || payload.role === "ADMIN_SUP") && (
      <NavDropdown title="Gestion" id="navbarScrollingDropdown">
        <NavDropdown.Item
          href="/InformeGestion"
          classename="nav-link3"
          onClick={onNavigate}
        >
          Tablero Control
        </NavDropdown.Item>
      </NavDropdown>
    )}

    {payload.role === "ADMIN_ROLE" && (
      <Link
        to="/quienes"
        className="nav-link ml-3 mt-2 mr-5"
        onClick={onNavigate}
      >
        Acerca
      </Link>
    )}
  </>
);

const NavBar = ({ layout = NAVBAR_LAYOUTS.HORIZONTAL }) => {
  //Defino location e history
  const location = useLocation();
  const history = useHistory();

  //estado para manejar el usuario
  const [user, setUser] = useState("Iniciar sesión");

  const [payload, setPayload] = useState({
    role: "",
  });

  const isVertical = layout === NAVBAR_LAYOUTS.VERTICAL;
  const [showOffcanvas, setShowOffcanvas] = useState(false);

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

  useEffect(() => {
    if (!isVertical) {
      setShowOffcanvas(false);
    }
  }, [isVertical]);

  const handleToggleOffcanvas = () => {
    setShowOffcanvas((prevState) => !prevState);
  };

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
  };

  const handleNavigate = () => {
    if (isVertical) {
      setShowOffcanvas(false);
    }
  };

  const renderMenuContent = (navClassName = "") => (
    <>
      <Nav className={navClassName || undefined}>
        <NavLinks payload={payload} onNavigate={handleNavigate} />
      </Nav>
      {payload.role === "ADMIN_ROLE" && (
        <Link
          to="/admin"
          id="user"
          className={`text-decoration-none text-muted ml-5 mr-3 ${
            isVertical ? "navBar-vertical-admin" : ""
          }`}
          onClick={handleNavigate}
        >
          Administrador
        </Link>
      )}
      <button
        id="booton"
        className={`btn btn-outline-info ${
          isVertical ? "navBar-vertical-login" : ""
        }`}
        onClick={() => {
          handleLogin();
          handleNavigate();
        }}
      >
        {user}
      </button>
    </>
  );

  const containerClasses = `navBar mr-auto ${
    isVertical ? "navBar-vertical" : ""
  }`;

  return (
    <div>
      <div id="navBar" className={containerClasses}>
        <Navbar
          bg="light"
          expand={isVertical ? false : "lg"}
          className={isVertical ? "navBar-vertical-navbar" : undefined}
        >
          <div
            className={`navBar-brand-wrapper ${
              isVertical ? "navBar-brand-wrapper-vertical" : ""
            }`}
          >
            <img src={logo} alt="logo" />
            <Link
              className="nav"
              to="/"
              onClick={isVertical ? handleNavigate : undefined}
            >
              <Navbar.Brand>Distri Pollo</Navbar.Brand>
            </Link>
          </div>

          {isVertical ? (
            <>
              <Button
                variant="outline-info"
                className="navBar-vertical-toggle"
                onClick={handleToggleOffcanvas}
              >
                Menú
              </Button>
              <Offcanvas
                show={showOffcanvas}
                onHide={handleCloseOffcanvas}
                placement="start"
                className="navBar-offcanvas"
              >
                <Offcanvas.Header closeButton closeVariant="white">
                  <Offcanvas.Title>Distri Pollo</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  {renderMenuContent("flex-column navBar-vertical-nav")}
                </Offcanvas.Body>
              </Offcanvas>
            </>
          ) : (
            <>
              <Navbar.Toggle
                id="hamburguesa"
                aria-controls="basic-navbar-nav"
              />
              <Navbar.Collapse id="basic-navbar-nav-light">
                {renderMenuContent()}
              </Navbar.Collapse>
            </>
          )}
        </Navbar>
      </div>
    </div>
  );
};

export default NavBar;
