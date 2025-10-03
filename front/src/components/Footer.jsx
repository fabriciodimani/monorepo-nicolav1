import React from "react";
import "../css/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logocode.png";

const Footer = () => {
  return (
    <footer id="footer" className="degradado-gris text-light py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-12 mb-3 mb-lg-0 text-center text-lg-left">
            <img src={logo} alt="logo" className="footer-logo mb-2" />
            <p className="mb-1">
              © Copyright 2021 <strong> Distripollo </strong>
            </p>
            <p className="mb-0">
              <strong> by Abeto Tech - División Web </strong>
            </p>
          </div>
          <div className="col-lg-4 d-none d-lg-block" />
          <div
            id="contacto"
            className="col-lg-4 col-md-12 text-center text-lg-right"
          >
            <p className="contact mb-1">
              <strong>CONTACTO</strong>
            </p>
            <p className="description-contact mb-1">
              Por consultas comuníquese con nosotros:
            </p>
            <p className="description-contact mb-1">
              Lun a Sab de 9 a 18 Hs - Tel +3816298096
            </p>
            <p className="description-contact mb-0">
              Domicilio: Eudoro Araoz 933
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
