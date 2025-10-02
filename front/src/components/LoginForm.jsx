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
        <div className="row">
          <div className="row-15">
            <div className="col-12">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-2">
                  <label className="">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-info btn-block mt-2"
                  disabled={user.loading}
                >
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
   
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginForm;
