import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { postLogin } from "../helpers/rutaUsuarios";
import Quienes from "../pages/Quienes";
// import AppCamionReactTable from "../table/AppCamionReactTable";
import App from "../App";
import "../css/loginform.css";
import Comandas from "../pages/Comandas";

const LoginForm = () => {
  const history = useHistory();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState({
    data: { ok: null },
    loading: false,
  });

  useEffect(() => {
    if (user.data.ok) {
      localStorage.setItem("token", JSON.stringify(user.data.token));
      localStorage.setItem("id", user.data.usuario._id);
      localStorage.setItem(
        "usuario",
        JSON.stringify(user.data.usuario.nombres)
      );

      history.push("./");
    }
  }, [user, history]);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setUser({
      ...user,
      loading: true,
    });

    postLogin(formValues).then((datos) => {
      setUser(datos);
    });
    setFormValues({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <main>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-btn" disabled={user.loading}>
            Enviar
          </button>
        </form>
        {console.log(user.data.ok)}
        {user.data.ok === false && (
          <div className="alert alert-dark mt-3 text-center" role="alert">
            {user.data.err.message}
          </div>
        )}

        {user.data.ok === true}
      </main>
    </>
  );
};

export default LoginForm;
