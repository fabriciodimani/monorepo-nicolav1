import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { getCarousel } from "../helpers/rutaPropiedades";
import Footer from "../components/Footer";
import "../css/quienes.css";
import distripollo from "../images/distripollo.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";

const Quienes = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="overlay">
              <div className="">
                <div id="cartel" className="col-md-12 text-center text-md-left">
                  <h2 className="mt-2">DISTRI POLLO</h2>
                  <p className="d-none d-md-block mt-1 mb-2">
                    Somos una empresa dedicada a la venta y distribución de
                    pollos y derivados. Hacemos envios a todo el interior sin
                    costos de traslado. Operamos con mercadería fresca sin
                    congelar, sin conservantes, lo que hace que la calidad de
                    nuestro productos sea la diferencia para nuestros clientes.
                    Eficiencia en la entrega puerta a puerta. Siempre imnovando,
                    ahora con un nuevo desarrollo.Una APP de servicios de
                    Pedido-Carga-Entrega de manera de mejorar y acelerar el
                    proceso de entrega.
                  </p>
                  <Link to="/comandas">
                    <button type="button" className="btn btn-dark mt-1 mb-2">
                      Hace tu Pedido
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col mt-2">
            <img
              className="imagen d-block w-50 mb-2"
              src={distripollo}
              alt="site 1"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Quienes;
