import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; //Paquete para decodificar el Token
import AddCliente from "../components/AddCliente";
import TableClientes from "../components/TableClientes";
import "../css/admin.css"
// import "../css/login.css";
import Footer from "../components/Footer";

const Clientes = () => {
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
       
            {/* <div className="row">
              <div className="col">
                <h2 className="mt-2">Administrador</h2>
                <hr />
              </div>
            </div>
         */}
          <div className="row">
            {state.role === "ADMIN_ROLE" ? (
              <>
                <div className="">
                  <h3 className ="mt-3 mb-2">ABM DE CLIENTES</h3>
                  <hr />                
                </div>
                <div className="mt-3 mb-3">
                  <AddCliente setShow={setShow} show={show} />
                </div>
                <div className="mt-3 mb-3">
                  {show === false && <TableClientes />}
                </div>
                {/* <div>
                  <h4>Ultimo Nro de Clientes</h4>
                </div> */}
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

export default Clientes;
