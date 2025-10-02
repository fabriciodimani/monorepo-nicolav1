import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPrecios } from "../helpers/rutaPrecios";

// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPrecioForm from "./AddPrecioForm";
// let busqueda = [];

const Precios = () => {
  const [precios, setPrecios] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getPrecios().then((precios) => {
      setPrecios({
        data: precios,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!precios.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h3>ALTA DE PRECIOS</h3>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {precios.data.precios.map((precio) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/precio/${precio._id}`}
                      className="text-decoration-none"
                    >
                      {/* <div className="card ml-4 mb-4">
                        <div className="card-body">
                          <h3 className="card-title">{empresa.razonsocial}</h3>
                          <h4 className="card-title">
                            {empresa.localidad.provincia.provincia}
                          </h4>
                          <h5 className="card-title">
                            {empresa.condicioniva.iva}
                          </h5>
                        </div>
                      </div> */}
                    </Link>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      )}
      <AddPrecioForm />
    </main>
  );
};

export default Precios;
