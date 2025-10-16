import React, { useEffect, useState, useCallback } from "react";
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

const formatCurrency = (valor) => {
  const numero = Number(valor) || 0;
  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

const CuentaCorriente = () => {
  const [usuario, setUsuario] = useState({});
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [cargandoMovimientos, setCargandoMovimientos] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [registrandoPago, setRegistrandoPago] = useState(false);

  const token = JSON.parse(localStorage.getItem("token")) || "";

  useEffect(() => {
    if (token) {
      try {
        const token_decode = jwt_decode(token);
        setUsuario(token_decode.usuario);
      } catch (err) {
        console.error("Error al decodificar el token", err);
      }
    }
  }, [token]);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const respuesta = await getClientes();
        if (respuesta.ok) {
          setClientes(respuesta.clientes || []);
        } else {
          const mensajeError =
            respuesta.err?.message || "No fue posible cargar los clientes";
          setError(mensajeError);
        }
      } catch (err) {
        setError("No fue posible cargar los clientes");
      }
    };

    cargarClientes();
  }, []);

  const cargarMovimientos = useCallback(async (clienteId) => {
    if (!clienteId) {
      setMovimientos([]);
      setSaldo(0);
      return;
    }

    setCargandoMovimientos(true);
    setMensaje("");
    setError("");

    try {
      const respuesta = await getMovimientosCuentaCorriente(clienteId);
      if (respuesta.ok) {
        setMovimientos(respuesta.movimientos || []);
        setSaldo(respuesta.saldo || 0);
      } else {
        const mensajeError =
          respuesta.err?.message || "No fue posible obtener los movimientos";
        setError(mensajeError);
        setMovimientos([]);
        setSaldo(0);
      }
    } catch (err) {
      setError("No fue posible obtener los movimientos");
      setMovimientos([]);
      setSaldo(0);
    } finally {
      setCargandoMovimientos(false);
    }
  }, []);

  useEffect(() => {
    cargarMovimientos(clienteSeleccionado);
  }, [clienteSeleccionado, cargarMovimientos]);

  const handleRegistrarPago = async ({
    clienteId,
    fecha,
    descripcion,
    monto,
  }) => {
    if (!clienteId) {
      const mensajeError = "Debe seleccionar un cliente";
      setError(mensajeError);
      return { ok: false, message: mensajeError };
    }

    setRegistrandoPago(true);
    setMensaje("");
    setError("");

    try {
      const respuesta = await registrarPagoCuentaCorriente({
        clienteId,
        fecha,
        descripcion,
        monto,
      });

      if (respuesta.ok) {
        setMensaje("Pago registrado correctamente");
        setSaldo(respuesta.saldo || 0);
        await cargarMovimientos(clienteId);
        return { ok: true };
      }

      const mensajeError =
        respuesta.err?.message || "No fue posible registrar el pago";
      setError(mensajeError);
      return { ok: false, message: mensajeError };
    } catch (err) {
      const mensajeError = "No fue posible registrar el pago";
      setError(mensajeError);
      return { ok: false, message: mensajeError };
    } finally {
      setRegistrandoPago(false);
    }
  };

  const estaLogueado = token && token.length > 0;
  const tienePermiso =
    usuario.role === "ADMIN_ROLE" || usuario.role === "ADMIN_SUP";

  return (
    <>
      <div className="cabecera">
        {estaLogueado ? (
          <div className="container mt-5">
            {tienePermiso ? (
              <>
                <div className="row">
                  <div className="col">
                    <h3 className="mt-3 mb-2">Cuenta Corriente</h3>
                    <hr />
                  </div>
                </div>
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
                <div className="row">
                  <div className="col-lg-4 mb-4">
                    <CuentaCorrientePagoForm
                      clientes={clientes}
                      clienteSeleccionado={clienteSeleccionado}
                      onClienteChange={setClienteSeleccionado}
                      onSubmit={handleRegistrarPago}
                      loading={registrandoPago}
                    />
                  </div>
                  <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">Movimientos</h5>
                      <span className="badge badge-primary p-2">
                        Saldo actual: {formatCurrency(saldo)}
                      </span>
                    </div>
                    {clienteSeleccionado ? (
                      <CuentaCorrienteTable
                        movimientos={movimientos}
                        saldoActual={saldo}
                        loading={cargandoMovimientos}
                      />
                    ) : (
                      <div className="alert alert-light" role="alert">
                        Seleccione un cliente para visualizar los movimientos.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="row">
                <div className="col">
                  <div className="alert alert-info" role="alert">
                    Lo sentimos, pero no tiene permisos para acceder a este
                    contenido
                  </div>
                </div>
              </div>
            )}
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
