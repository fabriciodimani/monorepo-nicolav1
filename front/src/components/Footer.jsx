import React from "react";
import "../css/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logocode.png";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-xs-12 col-md-12">
            <div className="row">
              <div className="col-lg-12 col-md-12 visible-md visible-lg copyright">
                <img src={logo} alt="logo" />
                <p>
                  © Copyright 2021 <strong> Distripollo </strong>
                </p>
              </div>
              <div className="col-lg-12 col-md-12 visible-md visible-lg copyright">
                <p>
                  <strong> by Abeto Tech - División Web </strong>
                </p>
              </div>
            </div>
          </div>
          <div className="col-4">
            {/* <a title="Whatsapp" 
                        href="https://wa.link/0zbip1"
                        target="_blank">
                        <img className="imag1" 
                            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN" 
                            alt="Whatsapp" 
                            width="100" 
                            height="100"
                        />
                    </a> */}
            {/* <h3>CONTACTANOS</h3> */}
          </div>

          <div id="contacto" className="col-lg-4 col-xs-12 col-md-12">
            <div className="row">
              <div className="col-md-12 hidden-xs hidden-sm ">
                <p className="contact">
                  <strong>CONTACTO</strong>
                </p>
                <p className="description-contact">
                  Por consultas comuníquese con nosotros:
                </p>
                <p className="description-contact">
                  Lun a Sab de 9 a 18 Hs - Tel +3816298096
                </p>
                {/* <p className="description-contact">Cel +5493816900030 +5493814909195</p> */}
                <p className="description-contact">
                  Domicilio: Eudoro Araoz 933
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
