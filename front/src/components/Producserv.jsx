import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducservs } from "../helpers/rutaProducservs";

// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddProducservForm from "./AddProducservForm";
// let busqueda = [];

const Producservs = () => {
  const [producservs, setProducservs] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getProducservs().then((producservs) => {
      setProducservs({
        data: producservs,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!producservs.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h2>ALTA DE PRODUCTO/SERVICIO</h2>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {producservs.data.producservs.map((producserv) => {
              return (
                <>
                  {/* <h5>{producserv.descripcion}</h5> */}
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/producserv/${producserv._id}`}
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
      <AddProducservForm />
    </main>
  );
};

export default Producservs;
