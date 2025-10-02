import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmpresas } from "../helpers/rutaEmpresas";
// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddEmpresaForm from "./AddEmpresaForm";
// let busqueda = [];

const Empresas = () => {
  const [empresas, setEmpresas] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getEmpresas().then((empresas) => {
      setEmpresas({
        data: empresas,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!empresas.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h3>ALTA DE EMPRESA</h3>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {empresas.data.empresas.map((empresa) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/empresa/${empresa._id}`}
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
      <AddEmpresaForm />
    </main>
  );
};

export default Empresas;
