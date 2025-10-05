import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Footer from "../components/Footer";
import CuentaCorrientePagoForm from "../components/cuentacorriente/CuentaCorrientePagoForm";
import CuentaCorrienteTable from "../components/cuentacorriente/CuentaCorrienteTable";
import { getClientes } from "../helpers/rutaClientes";
import {
  getMovimientosCuentaCorriente,
  registrarPagoCuentaCorriente,
} from "../helpers/rutaCuentaCorriente";

const CuentaCorriente = () => {
  const [usuario, setUsuario] = useState({});
  const [clientes, setClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const token = JSON.parse(localStorage.getItem("token")) || "";

  useEffect(() => {
    if (token) {
      try {
        const token_decode = jwt_decode(token);
        setUsuario(token_decode.usuario);
      } catch (decodeError) {
        setError("No fue posible validar la sesión. Inicie sesión nuevamente.");
      }
    }
  }, [token]);

  useEffect(() => {
    const cargarClientes = async () => {
      const response = await getClientes();

      if (response?.ok) {
        const clientesOrdenados = [...(response.clientes || [])].sort((a, b) =>
          (a.razonsocial || "").localeCompare(b.razonsocial || "")
        );
        setClientes(clientesOrdenados);
      } else {
        const mensajeError =
          response?.err?.message ||
          response?.data?.err?.message ||
          "No fue posible obtener el listado de clientes";
        setError(mensajeError);
      }
    };

    cargarClientes();
  }, []);

  const cargarMovimientos = async (clienteId) => {
    if (!clienteId) {
      setMovimientos([]);
      setSaldo(null);
      return;
    }

    setLoadingMovimientos(true);
    setError("");

    const response = await getMovimientosCuentaCorriente(clienteId);

    if (response?.ok) {
      setMovimientos(response.movimientos || []);
      setSaldo(response.saldo ?? 0);
    } else {
      setError(response?.err?.message || "No se pudo cargar la información");
      setMovimientos([]);
    }

    setLoadingMovimientos(false);
  };

  const handleClienteChange = (clienteId) => {
    setSelectedClienteId(clienteId);
    setMensaje("");
    cargarMovimientos(clienteId);
  };

  const handleRegistrarPago = async (datos) => {
    setLoadingPago(true);
    setError("");
    setMensaje("");

    const response = await registrarPagoCuentaCorriente(datos);

    if (response?.ok) {
      setMensaje("Pago registrado correctamente");
      const nuevoSaldo = response.saldo ?? saldo;
      setSaldo(nuevoSaldo);
      await cargarMovimientos(datos.clienteId);
    } else {
      setError(response?.err?.message || "No se pudo registrar el pago");
    }

    setLoadingPago(false);
  };

  const puedeAcceder =
    usuario.role === "ADMIN_ROLE" || usuario.role === "ADMIN_SUP";

  return (
    <>
      <div className="cabecera">
        {token.length > 0 ? (
          <div className="container mt-5">
            <div className="row">
              {puedeAcceder ? (
                <div className="col-12">
                  <h3 className="mt-3 mb-3">Cuenta Corriente</h3>
                  <CuentaCorrientePagoForm
                    clientes={clientes}
                    selectedClienteId={selectedClienteId}
                    onClienteChange={handleClienteChange}
                    onSubmit={handleRegistrarPago}
                    loading={loadingPago}
                    saldoActual={saldo}
                  />

                  {mensaje && (
                    <div className="alert alert-success" role="alert">
                      {mensaje}
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {loadingMovimientos ? (
                    <div className="alert alert-info" role="alert">
                      Cargando movimientos...
                    </div>
                  ) : (
                    <CuentaCorrienteTable movimientos={movimientos} />
                  )}
                </div>
              ) : (
                <div className="col">
                  <div className="alert alert-info" role="alert">
                    Lo sentimos, pero no tiene permisos para acceder a este
                    contenido
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="container mt-5">
            <div className="row">
              <div className="col">
                <div className="alert alert-danger" role="alert">
                  No se encuentra logueado en la plataforma
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CuentaCorriente;
