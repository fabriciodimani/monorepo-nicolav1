import React from "react";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import "../css/login.css";

const Login = () => {
  return (
    <div className="">
      <div className="container mt-5">
        <div className="row text-center mb-3">
          <div className="col-12">
            <h1>Iniciar Sesión</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 offset-lg-4">
            <p className="text-center">Ingresa tu correo electrónico</p>

            <LoginForm />

            <div className="text-center text-muted mt-4 mb-5">
              <span>
                Al continuar con tu correo aceptas los términos y condiciones y
                el aviso de privacidad.
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
