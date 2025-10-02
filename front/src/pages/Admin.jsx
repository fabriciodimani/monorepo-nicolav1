import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; //Paquete para decodificar el Token
import AddComanda from "../components/AddComanda";

import ComandaProvider from "../Context/ComandaContext";

import BarraBusqueda from "../components/BarraBusqueda";
import "../css/admin.css";
// import "../css/login.css";
import Footer from "../components/Footer";

const Admin = () => {
  const [state, setState] = useState({});
  const [show, setShow] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (token) {
      let token_decode = jwt_decode(token); //Obteniendo los datos del payload del token

      setState(token_decode.usuario);
    }
  }, [token]);

  return (
    <>
      <div className="cabecera">
        {token.length > 0 ? (
          <div className="container mt-5">
            <div className="row">
              {state.role === "ADMIN_ROLE" ? (
                <>
                  <div className="col">
                    <h3 className="mb-2">ABM de Comandas</h3>
                    <hr />
                  </div>
                  <AddComanda setShow={setShow} show={show} />

                  {show === false && (
                    <ComandaProvider>
                      <BarraBusqueda />{" "}
                    </ComandaProvider>
                  )}
                </>
              ) : (
                <div className="col">
                  <div className="alert alert-info" role="alert">
                    Lo sentimos, pero no tiene permisos para acceder a este
                    contenido
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="container mt-5">
            <div className="row">
              <div className="col">
                <div className="alert alert-danger" role="alert">
                  No se encuentra logueado en la plataforma
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Admin;
