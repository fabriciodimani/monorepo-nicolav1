import React from "react";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import "../css/login.css";

const Login = () => {
  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-description">Ingresa tu correo electrónico</p>

          <LoginForm />

          <div className="login-legal">
            <span>
              Al continuar con tu correo aceptas los términos y condiciones y el
              aviso de privacidad.
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
