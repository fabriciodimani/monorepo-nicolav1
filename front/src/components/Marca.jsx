import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMarcas } from "../helpers/rutaMarcas";

// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddMarcaForm from "./AddMarcaForm";
// let busqueda = [];

const Marcas = () => {
  const [marcas, setMarcas] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getMarcas().then((marcas) => {
      setMarcas({
        data: marcas,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!marcas.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h3>ALTA DE MARCA</h3>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {marcas.data.marcas.map((marca) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/marca/${marca._id}`}
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
      <AddMarcaForm />
    </main>
  );
};

export default Marcas;
