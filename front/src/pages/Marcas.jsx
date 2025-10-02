import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; //Paquete para decodificar el Token
import AddMarca from "../components/AddMarca";
import TableMarcas from "../components/TableMarcas";
import "../css/admin.css";
// import "../css/login.css";
import Footer from "../components/Footer";

const Marcas = () => {
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
                    <h3 className="mt-3 mb-2">ABM DE MARCAS</h3>
                    <hr />
                  </div>
                  <div className="mt-3 mb-3">
                    <AddMarca setShow={setShow} show={show} />
                  </div>
                  <div className="mt-3 mb-3">
                    {show === false && <TableMarcas />}
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

export default Marcas;

// import React from "react";
// import Marca from "../components/Marca";
// import Footer from "../components/Footer";

// // import "../css/empresa.css";
// import "../css/footer.css";

// const Marcas = () => {
//   return (
//     <>
//       <Marca />
//       <Footer />
//     </>
//   );
// };

// export default Marcas;
