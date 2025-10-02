import React, { useState, useEffect } from "react";
// import { addCliente } from "../helpers/rutaClientes";
// import { addComanda } from "../helpers/rutaComandas";
// import ActualizaComanda from "../components/ActualizaComanda"
import ActualizaComanda from "./ActualizaComanda";

import AddFormDynamics from "./AddFormDynamics";
// import { getUltimacomandas } from "../helpers/rutaUltimacomandas";
import { getClientes } from "../helpers/rutaClientes";
import { getUsuarios } from "../helpers/rutaUsuarios";
// import { getProducservs } from "../helpers/rutaProducservs";
import { getListas } from "../helpers/rutaListas";
import "../css/addcomandaform.css";

const AddComandaForm = () => {
  const [guardar, setGuardar] = useState(false);
  const [show, setShow] = useState(false);
  const [nrodecomanda, setNrodecomanda] = useState("");

  // useEffect(() => {
  //   getUltimacomandas().then((comandas) => {
  //     setNrodecomanda({
  //       data: comandas,
  //       loading: false,
  //     });
  //   });
  // }, []);

  const [codcli, setCodcli] = useState("");

  const [lista, setLista] = useState("");

  const [usuario, setUsuario] = useState("");

  const [formValues, setFormValues] = useState({
    nrodecomanda: "",
    codcli: "",
    lista: "",
    // usuario: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // localStorage.setItem("nrodecomanda", nrodecomanda);

    setGuardar(true);
    setShow(true);

    localStorage.setItem("codcli", codcli);
    localStorage.setItem("lista", lista);
    // localStorage.setItem("usuario", usuario);
    document.getElementById("codcli").disabled = true;
    document.getElementById("lista").disabled = true;
    // document.getElementById("usuario").disabled = true;
    
  };

  const [clientes, setClientes] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getClientes().then((clientes) => {
      setClientes({
        data: clientes,
        loading: false,
      });
    });
  }, []);

  const [listas, setListas] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getListas().then((listas) => {
      setListas({
        data: listas,
        loading: false,
      });
    });
  }, []);

  const [usuarios, setUsuarios] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getUsuarios().then((usuarios) => {
      setUsuarios({
        data: usuarios,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!clientes.loading && !listas.loading && !usuarios.loading &&(
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="form-row">
              <div className="form-group col-sm-3 mr-5 mb-2">
                <label className="mr-3">Cliente</label>
                <select
                  type="text"
                  className="form-control col-sm-12"
                  name="codcli"
                  id="codcli"
                  maxLength="30"
                  required
                  onChange={(e) => {
                    setCodcli(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {clientes.data.clientes.map((cliente) => (
                    <option value={cliente._id}>{cliente.razonsocial} - RUTA:
                    {(cliente.ruta.ruta)}</option>
                  ))}
                  {/* {localStorage.setItem("razonsocial", cliente.razonsocial)}; */}
                </select>
              </div>

              <div className="form-group col-sm-2">
                <label className="">Lista</label>
                <select
                  type="text"
                  className="form-control col-sm-6"
                  name="lista"
                  id="lista"
                  maxLength="30"
                  required
                  onChange={(e) => {
                    setLista(e.target.value);
                  }}
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {listas.data.listas.map((lista) => (
                    <option value={lista._id}>{lista.lista}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-dark mt-4 mb-3"
                id="button"
                // onsubmit="return false"
                //onClick={guardar ? ActualizaComanda() : null}
              >
                Guardar Cabecera
              </button>
            </div>
          </div>
        </form>
      )}
      {/* {guardar ? ActualizaComanda() : null} */}
      {/* <AddFormDynamics guardar /> */}
      {show ? <AddFormDynamics guardar /> : null}
    </>
  );
};
export default AddComandaForm;
