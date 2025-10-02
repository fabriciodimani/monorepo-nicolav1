import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRemitos } from "../helpers/rutaRemitos";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddRemitoForm from "./AddRemitoForm";
// let busqueda = [];

// dateFormat("Jun 9 2007", "fullDate");
// const now = new Date();

const Remitos = (props) => {
  // let newnrodecomanda = props.datacomanda + 1;
  const [remitos, setRemitos] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getRemitos().then((remitos) => {
      setRemitos({
        data: remitos,
        loading: false,
      });
    });
  }, []);

  // let fecha = new Date().toISOString().replace(/T/,' ').replace(/\..+/,'');
  let fecha = new Date().toLocaleDateString();

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!remitos.loading && (
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-3">
              <h3>CARGAR REMITO</h3>
            </div>
            <div className="col-md-6 mt-3">
              <h4>Fecha Carga del Remito: {fecha}</h4>
            </div>
            {/* <hr></hr> */}
          </div>

          <div className="row ml-4">
            {remitos.data.remitos.map((remito) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/remito/${remito._id}`}
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
      <AddRemitoForm />
    </main>
  );
};

export default Remitos;
