import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLocalidades } from "../helpers/rutaLocalidades";

// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddLocalidadForm from "./AddLocalidadForm";
// let busqueda = [];

const Localidades = () => {
  const [localidades, setLocalidades] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getLocalidades().then((localidades) => {
      setLocalidades({
        data: localidades,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!localidades.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h3>ALTA DE LOCALIDAD</h3>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {localidades.data.localidades.map((localidad) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/localidad/${localidad._id}`}
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
      <AddLocalidadForm />
    </main>
  );
};

export default Localidades;
