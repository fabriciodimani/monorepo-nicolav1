import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Footer from "../components/Footer";
import CuentaCorrientePagoForm from "../components/CuentaCorrientePagoForm";
import CuentaCorrienteTable from "../components/CuentaCorrienteTable";
import { getClientes } from "../helpers/rutaClientes";
import {
  getMovimientosCuentaCorriente,
  registrarPagoCuentaCorriente,
} from "../helpers/rutaCuentaCorriente";
import "../css/admin.css";

const formatearSaldo = (valor) =>
  Number(valor || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CuentaCorriente = () => {
  const [usuario, setUsuario] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [movimientos, setMovimientos] = useState([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [pagoEnProceso, setPagoEnProceso] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [errorCargaClientes, setErrorCargaClientes] = useState("");

  const token = JSON.parse(localStorage.getItem("token")) || "";

  useEffect(() => {
    if (token.length > 0) {
      try {
        const tokenDecode = jwt_decode(token);
        setUsuario(tokenDecode.usuario);
        cargarClientes();
      } catch (error) {
        setMensaje({
          tipo: "error",
          texto: "No fue posible validar el usuario autenticado.",
        });
      }
    }
  }, [token]);

  const cargarClientes = async () => {
    const respuesta = await getClientes();
    if (respuesta.ok) {
      setClientes(respuesta.clientes || []);
    } else {
      setErrorCargaClientes(
        "No se pudieron cargar los clientes. Intente nuevamente más tarde."
      );
    }
  };

  const esUsuarioAutorizado =
    usuario && (usuario.role === "ADMIN_ROLE" || usuario.role === "ADMIN_SUP");

  const obtenerMovimientos = async (clienteId) => {
    setLoadingMovimientos(true);
    const respuesta = await getMovimientosCuentaCorriente(clienteId);
    if (respuesta.ok) {
      setMovimientos(respuesta.movimientos || []);
      setSaldo(respuesta.saldo ?? 0);
      setMensaje({ tipo: "", texto: "" });
    } else {
      setMovimientos([]);
      setSaldo(0);
      setMensaje({
        tipo: "error",
        texto:
          respuesta.err?.message ||
          "No se pudo obtener la cuenta corriente del cliente.",
      });
    }
    setLoadingMovimientos(false);
  };

  const handleSeleccionCliente = async (event) => {
    const clienteId = event.target.value;
    setSelectedClienteId(clienteId);
    setMensaje({ tipo: "", texto: "" });
    if (clienteId) {
      await obtenerMovimientos(clienteId);
    } else {
      setMovimientos([]);
      setSaldo(0);
    }
  };

  const registrarPago = async (datos) => {
    setPagoEnProceso(true);
    setMensaje({ tipo: "", texto: "" });
    const respuesta = await registrarPagoCuentaCorriente(datos);
    setPagoEnProceso(false);

    if (respuesta.ok) {
      setSaldo(respuesta.saldo ?? 0);
      await obtenerMovimientos(datos.clienteId);
      setMensaje({
        tipo: "success",
        texto: "Pago registrado correctamente.",
      });
      return true;
    }

    setMensaje({
      tipo: "error",
      texto:
        respuesta.err?.message ||
        "No se pudo registrar el pago. Verifique los datos e intente nuevamente.",
    });
    return false;
  };

  return (
    <>
      <div className="cabecera">
        {token.length > 0 ? (
          <div className="container mt-5">
            <div className="row">
              <div className="col">
                <h3 className="mt-3 mb-3">Cuenta Corriente</h3>
                <hr />
              </div>
            </div>
            {!esUsuarioAutorizado ? (
              <div className="alert alert-info" role="alert">
                Lo sentimos, pero no tiene permisos para acceder a este contenido.
              </div>
            ) : (
              <>
                {errorCargaClientes && (
                  <div className="alert alert-danger" role="alert">
                    {errorCargaClientes}
                  </div>
                )}
                <div className="mb-3">
                  <label
                    htmlFor="clienteSeleccionado"
                    className="font-weight-bold"
                  >
                    Seleccione un cliente
                  </label>
                  <select
                    id="clienteSeleccionado"
                    className="form-control"
                    value={selectedClienteId}
                    onChange={handleSeleccionCliente}
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente._id} value={cliente._id}>
                        {cliente.razonsocial}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedClienteId && (
                  <div className="mb-3">
                    <h5>
                      Saldo actual: ${" "}
                      {formatearSaldo(saldo)}
                    </h5>
                  </div>
                )}
                {mensaje.texto && (
                  <div
                    className={`alert alert-$
                      {
                        mensaje.tipo === "success" ? "success" : "danger"
                      }
                    `}
                    role="alert"
                  >
                    {mensaje.texto}
                  </div>
                )}
                <CuentaCorrientePagoForm
                  clientes={clientes}
                  selectedClienteId={selectedClienteId}
                  onSubmit={registrarPago}
                  loading={pagoEnProceso}
                />
                <CuentaCorrienteTable
                  movimientos={movimientos}
                  loading={loadingMovimientos}
                />
              </>
            )}
          </div>
        ) : (
          <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
              No se encuentra logueado en la plataforma
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CuentaCorriente;
