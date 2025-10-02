import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRubros } from "../helpers/rutaRubros";

// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddRubroForm from "./AddRubroForm";
// let busqueda = [];

const Rubros = () => {
  const [rubros, setRubros] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getRubros().then((rubros) => {
      setRubros({
        data: rubros,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!rubros.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h3>ALTA DE RUBRO</h3>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {rubros.data.rubros.map((rubro) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/rubro/${rubro._id}`}
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
      <AddRubroForm />
    </main>
  );
};

export default Rubros;
