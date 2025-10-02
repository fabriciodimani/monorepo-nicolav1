import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRutas } from "../helpers/rutaRutas";

// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddRutaForm from "./AddRutaForm";
// let busqueda = [];

const Rutas = () => {
  const [rutas, setRutas] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getRutas().then((rutas) => {
      setRutas({
        data: rutas,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!rutas.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h3>ALTA DE RUTA</h3>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {rutas.data.rutas.map((ruta) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/ruta/${ruta._id}`}
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
      <AddRutaForm />
    </main>
  );
};

export default Rutas;
