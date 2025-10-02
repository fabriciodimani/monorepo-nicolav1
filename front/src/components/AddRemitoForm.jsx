import React, { useState, useEffect } from "react";
import AddRemitoFormDynamics from "../components/AddRemitoFormDynamics";
import { getProveedores } from "../helpers/rutaProveedores";
import "../css/addcomandaform.css";

const AddRemitoForm = () => {
  //variables de localstorage nro com cliente lista

  const [mostrar, setMostrar] = useState(false);

  //const [nroderemito, setNroderemito] = useState("");
  const [codprov, setCodprov] = useState("");

  // const [lista, setLista] = useState("");

  const [formValues, setFormValues] = useState({
    nroderemito: "",
    codprov: "",
    fecha: "",
    // lista: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    //document.getElementById("nroderemito").readOnly = true;

    document.getElementById("nroderemito").disabled = true;
    document.getElementById("codprov").disabled = true;
    document.getElementById("fecha").disabled = true;

    localStorage.setItem("nroderemito", formValues.nroderemito);
    localStorage.setItem("fecha", formValues.fecha);
    localStorage.setItem("codprov", codprov);

    // document.getElementById("lista").disabled = true;

    // document.getElementById("fecha").disabled = true;

    setMostrar(true);

    // document.addEventListener("DOMContentLoaded", function (event) {
    //   document.getElementById("nroderemito").disabled = true;
    // });

    // let input = document.querySelector(".input");
    // let button = document.querySelector(".button");
    // input.disabled = true;
    // button.disabled = true;
    // input.addEventListener("change", stateHandle);
    // function stateHandle() {
    //   if (document.querySelector(".input").value === "") {
    //     button.disabled = true;
    //   } else {
    //     button.disabled = false;
    //   }
    // }
    //window.location.reload(false);
    // e.preventDefault();

    // <AddFormDynamics />;
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const [proveedores, setProveedores] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getProveedores().then((proveedores) => {
      setProveedores({
        data: proveedores,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!proveedores.loading && (
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="form-row">
              <div className="form-group col-sm-2">
                <label className="mt-4">Nro de Remito</label>
                <input
                  type="text"
                  className="form-control"
                  name="nroderemito"
                  id="nroderemito"
                  maxLength="20"
                  required
                  value={formValues.nroderemito}
                  onChange={handleChange}
                />
                {console.log(formValues.nroderemito)}
              </div>

              <div className="form-group col-sm-3">
                <label className="mt-4">Proveedor</label>
                <select
                  type="text"
                  className="form-control"
                  name="codprov"
                  id="codprov"
                  maxLength="30"
                  required
                  onChange={(e) => {
                    setCodprov(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <option selected value="">
                    Elija la opción
                  </option>
                  {proveedores.data.proveedores.map((proveedor) => (
                    <option value={proveedor._id}>
                      {proveedor.razonsocial}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-sm-3">
                <label className="mt-4">Fecha del Remito</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha"
                  id="fecha"
                  maxLength="30"
                  required
                  value={formValues.fecha}
                  onChange={handleChange}
                />
                {console.log(formValues.fecha)}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-dark mt-5 mb-3"
                id="button"
                // onsubmit="return false"
                // onClick={<AddFormDynamics />}
              >
                Guardar Cabecera
              </button>
            </div>
          </div>
        </form>
      )}
      {mostrar && <AddRemitoFormDynamics />}
    </>
  );
};
export default AddRemitoForm;
