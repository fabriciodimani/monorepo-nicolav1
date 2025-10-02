import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComandas } from "../helpers/rutaComandas";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddComandaForm from "./AddComandaForm";
// let busqueda = [];

// dateFormat("Jun 9 2007", "fullDate");
// const now = new Date();

const Comandas = (props) => {
  // let newnrodecomanda = props.datacomanda + 1;

  // const [comandas, setComandas] = useState({
  //   data: {},
  //   loading: true,
  // });

  // useEffect(() => {
  //   getComandas().then((comandas) => {
  //     setComandas({
  //       data: comandas,
  //       loading: false,
  //     });
  //   });
  // }, []);

  // let fecha = new Date().toISOString().replace(/T/,' ').replace(/\..+/,'');
  //let fecha = new Date().toLocaleDateString();

  return (
    <main>
      {/* {!comandas.loading && (
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-3">
              <h3>CARGAR COMANDA</h3>
            </div>
          </div>
        </div>   
      )} */}
      <AddComandaForm />
    </main>
  );
};

export default Comandas;
