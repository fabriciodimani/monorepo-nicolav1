import React from "react";
import "../css/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logocode.png";

const Footer = () => {
  return (
    <footer id="footer" className="alt">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 footer-section">
            <div className="footer-card">
              <img src={logo} alt="Distripollo logo" />
              <p>
                Soluciones integrales para tu negocio gastronómico, con
                distribución confiable y soporte cercano en cada pedido.
              </p>
              <p className="footer-meta mb-0">
                © Copyright {new Date().getFullYear()} <strong>Distripollo</strong>
              </p>
              <p className="footer-meta">
                Diseñado por <strong>Abeto Tech - División Web</strong>
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 footer-section">
            <div className="footer-card">
              <h3 className="footer-heading">Enlaces rápidos</h3>
              <ul className="footer-links">
                <li>
                  <a href="/#productos">Productos</a>
                </li>
                <li>
                  <a href="/#servicios">Servicios</a>
                </li>
                <li>
                  <a href="/#nosotros">Nosotros</a>
                </li>
                <li>
                  <a href="/#contacto">Contacto</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-12 footer-section">
            <div className="footer-card">
              <h3 className="footer-heading">Atención al cliente</h3>
              <p>
                Para consultas y pedidos comuníquese con nosotros de lunes a
                sábado de 9 a 18 h.
              </p>
              <p className="mb-1">Teléfono: +54 381 629 8096</p>
              <p className="mb-3">Domicilio: Eudoro Araoz 933</p>
              <a className="btn footer-cta" href="mailto:contacto@distripollo.com">
                Escríbenos por correo
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
