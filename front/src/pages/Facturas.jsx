import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import AddFactura from "../components/AddFactura";
import TableFacturas from "../components/TableFacturas";
import "../css/admin.css";
import Footer from "../components/Footer";

const Facturas = () => {
  const [state, setState] = useState({});
  const [show, setShow] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      const tokenDecode = jwt_decode(token);
      setState(tokenDecode.usuario);
    }
  }, [token]);

  return (
    <>
      <div className="cabecera">
        {token?.length > 0 ? (
          <div className="container mt-5">
            <div className="row">
              {state.role === "ADMIN_ROLE" || state.role === "ADMIN_SUP" ? (
                <>
                  <div className="col-12">
                    <h3 className="mt-3 mb-2">Registro de Facturas de Compra</h3>
                    <hr />
                  </div>
                  <div className="mt-3 mb-3 w-100">
                    <AddFactura setShow={setShow} show={show} />
                  </div>
                  <div className="mt-3 mb-3 w-100">
                    {show === false && <TableFacturas />}
                  </div>
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
      <Footer />
    </>
  );
};

export default Facturas;
