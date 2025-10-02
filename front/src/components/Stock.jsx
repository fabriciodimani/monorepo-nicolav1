import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStocks } from "../helpers/rutaStocks";

// import Cargando from "../components/Cargando";
import "../css/principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddStockForm from "./AddStockForm";
// let busqueda = [];

const Stocks = () => {
  const [stocks, setStocks] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getStocks().then((stocks) => {
      setStocks({
        data: stocks,
        loading: false,
      });
    });
  }, []);

  return (
    <main>
      {/* <div>{propiedades.loading && <Cargando />}</div> */}
      {!stocks.loading && (
        <div className="container">
          <div className="mb-4">
            <div className="mt-3">
              <h3>MOVIMIENTO DE STOCK</h3>
              <hr></hr>
            </div>
          </div>

          <div className="row ml-4">
            {stocks.data.stocks.map((stock) => {
              return (
                <>
                  <div id="card" className="col-lg-12 ml-5">
                    <Link
                      to={`/stock/${stock._id}`}
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
      <AddStockForm />
    </main>
  );
};

export default Stocks;
