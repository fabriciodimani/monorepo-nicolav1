import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; //Paquete para decodificar el Token
import AddProducserv from "../components/AddProducserv";
import TableStock from "../components/TableStock";
import "../css/admin.css";
import Stock from "../components/Stock";
import Footer from "../components/Footer";
import "../css/footer.css";

const Stocks = () => {
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
      <Stock />
      <div className="cabecera">
        {token.length > 0 ? (
          <div className="container">
             <div className="row">
              {state.role === "ADMIN_ROLE" ? (
                <>
                 <div>
                    {show === false && <TableStock />}
                  </div>
                </>
              ) : 
              
              state.role === "USER_STK" ? (
                <>
                 <div>
                    {show === false && <TableStock />}
                  </div>
                </>
              ) : 
              
              (
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

export default Stocks;
