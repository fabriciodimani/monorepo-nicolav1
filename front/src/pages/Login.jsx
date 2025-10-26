import React from "react";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import "../css/login.css";

const Login = () => {
  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <div className="text-center mb-3">
            <h1>Iniciar Sesión</h1>
          </div>
          <p className="text-center">Ingresa tu correo electrónico</p>

          <LoginForm />

          <div className="text-center text-muted mt-4">
            <span>
              Al continuar con tu correo aceptas los términos y condiciones y el
              aviso de privacidad.
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
