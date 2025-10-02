import React, { useState, useEffect } from "react";
import { getComandas } from "../helpers/rutaComandas";
import { modifComanda } from "../helpers/rutaComandas";
import { Modal, Button } from "react-bootstrap";
import { getClientes } from "../helpers/rutaClientes";
import { getProducservs } from "../helpers/rutaProducservs";
import { getListas } from "../helpers/rutaListas";
import { getEstados } from "../helpers/rutaEstados";
import { getCamiones } from "../helpers/rutaCamiones";
import { getUsuarios } from "../helpers/rutaUsuarios";

import "../css/modalcomanda.css";

const ModalFormAsignar = ({ comanda, handleClose }) => {
  const [comandas, setComandas] = useState({});
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    getComandas().then((comandas) => {
      setComandas({
        data: comandas,
        loading: false,
      });
    });
  }, []);
  console.log(comanda);

  console.log("aaaa", comanda[0].codestado.estado);

  // const id = JSON.parse(localStorage.getItem("id"));
  const [formValues, setFormValues] = useState({
    // codcli: comanda.codcli,
    // lista: comanda.lista,
    // codprod: comanda.comandas.codprod,
    // cantidad: comanda.comandas.cantidad,
    // monto: comanda.comandas.monto,
    //codestado: comanda[0].codestado._id,
    camion: "",
    camionero: "",

    // entregado: comanda.comandas.entregado,
    // usuario: id,
  });
  console.log(formValues);
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    // console.log(comanda.comandas._id);
    var res;

    e.preventDefault();
    if (!comandas.loading) {
      for (let i = 0; i < comanda.length; i++) {
        await modifComanda(formValues, comanda[i]._id).then(
          (respuesta) => (res = respuesta)
        );

        // <h3>Cargando</h3>
        // alert("aaa");
        // .catch((error) => window.alert("error al actualizar"))

        // .finally(() => {
          setActualizando(true);
        // });
      }
      
      // console.log(res);
      // debugger;

      // if (actualizando) {
      window.alert("Actualizado correctamente...");
      // window.location.reload();
      // }

      handleClose();
      window.location.reload();

      // <>{!actualizando && alert("Cambio Exitoso !!!")}</>
    }
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

  const [producservs, setProducservs] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getProducservs().then((producservs) => {
      setProducservs({
        data: producservs,
        loading: false,
      });
    });
  }, []);

  const [estados, setEstados] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getEstados().then((estados) => {
      setEstados({
        data: estados,
        loading: false,
      });
    });
  }, []);

  const [camiones, setCamiones] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getCamiones().then((camiones) => {
      setCamiones({
        data: camiones,
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
      {!clientes.loading &&
        !listas.loading &&
        !producservs.loading &&
        !estados.loading &&
        !camiones.loading &&
        !usuarios.loading && (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-group">
                <label>Asigne el Camionero/Chofer</label>
                <select
                  className="form-control mt-0 mb-3"
                  id="distribucion"
                  name="camionero"
                  value={formValues.camionero}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {usuarios.data.usuarios.map((usuario) => (
                    <>
                      {usuario.role === "USER_CAM" ? (
                        <option value={usuario._id}>{usuario.nombres}</option>
                      ) : null}
                    </>
                  ))}
                </select>
              </div>

              <div className="form-group mb-5">
                <label>
                  Camion/Punto de Distribucion en RUTA:{" "}
                  {comanda[0].codcli.ruta.ruta}{" "}
                </label>
                <select
                  className="form-control mt-0 mb-3"
                  id="distribucion"
                  name="camion"
                  value={formValues.camion}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {camiones.data.camiones.map((camion) => (
                    <option value={camion._id}>{camion.camion}</option>
                  ))}
                </select>
              </div>

              {actualizando &&
                <div className="mt-3">
                  <h4  className="actualizando mt-3">Actualizando Registros, en RUTA: {" "}
                    {comanda[0].codcli.ruta.ruta}{" "}</h4>
                  <h4  className="actualizando mt-3">Por favor espere .......</h4>
                </div>
              }

            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="dark">
                Guardar
              </Button>
            </Modal.Footer>
          </form>
        )}
      ;
    </>
  );
};

export default ModalFormAsignar;

// setTimeout(() => {
//       console.log("1.5 Segundo esperado");
//     }, 11500);
