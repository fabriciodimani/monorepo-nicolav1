import React, { useEffect, useState, useCallback } from "react";
import jwt_decode from "jwt-decode";
import Footer from "../components/Footer";
import CuentaCorrientePagoForm from "../components/CuentaCorrientePagoForm";
import CuentaCorrienteTable from "../components/CuentaCorrienteTable";
import { getProveedoresPorNombre } from "../helpers/rutaProveedores";
import {
  getMovimientosCuentaCorrienteProveedores,
  registrarPagoCuentaCorrienteProveedor,
} from "../helpers/rutaCuentaCorrienteProveedores";
import "../css/admin.css";

const CuentaCorrienteProveedores = () => {
  const [usuario, setUsuario] = useState({});
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [cargandoMovimientos, setCargandoMovimientos] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [registrandoPago, setRegistrandoPago] = useState(false);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);
  const [errorBusquedaProveedores, setErrorBusquedaProveedores] = useState("");

  const token = JSON.parse(localStorage.getItem("token")) || "";

  useEffect(() => {
    if (token) {
      try {
        const tokenDecode = jwt_decode(token);
        setUsuario(tokenDecode.usuario);
      } catch (err) {
        console.error("Error al decodificar el token", err);
      }
    }
  }, [token]);

  useEffect(() => {
    const termino = busquedaProveedor.trim();

    if (termino.length < 3) {
      setProveedores([]);
      setCargandoProveedores(false);
      setErrorBusquedaProveedores("");
      return;
    }

    let cancelado = false;
    setCargandoProveedores(true);
    setErrorBusquedaProveedores("");

    const timeoutId = setTimeout(async () => {
      try {
        const respuesta = await getProveedoresPorNombre(termino);
        if (cancelado) {
          return;
        }

        if (respuesta.ok) {
          const lista = Array.isArray(respuesta.proveedores)
            ? respuesta.proveedores.slice(0, 30)
            : [];
          setProveedores(lista);
          setErrorBusquedaProveedores("");
        } else {
          const mensajeError =
            respuesta.err?.message || "No fue posible buscar proveedores";
          setErrorBusquedaProveedores(mensajeError);
          setProveedores([]);
        }
      } catch (err) {
        if (!cancelado) {
          setErrorBusquedaProveedores("No fue posible buscar proveedores");
          setProveedores([]);
        }
      } finally {
        if (!cancelado) {
          setCargandoProveedores(false);
        }
      }
    }, 300);

    return () => {
      cancelado = true;
      clearTimeout(timeoutId);
    };
  }, [busquedaProveedor]);

  useEffect(() => {
    if (
      proveedorSeleccionado &&
      !proveedores.some((proveedor) => proveedor._id === proveedorSeleccionado)
    ) {
      setProveedorSeleccionado("");
    }
  }, [proveedores, proveedorSeleccionado]);

  const cargarMovimientos = useCallback(async (proveedorId) => {
    if (!proveedorId) {
      setMovimientos([]);
      setSaldo(0);
      return;
    }

    setCargandoMovimientos(true);
    setMensaje("");
    setError("");

    try {
      const respuesta = await getMovimientosCuentaCorrienteProveedores(proveedorId);
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
    cargarMovimientos(proveedorSeleccionado);
  }, [proveedorSeleccionado, cargarMovimientos]);

  const handleRegistrarPago = async ({
    clienteId,
    fecha,
    descripcion,
    monto,
  }) => {
    const proveedorId = clienteId;

    if (!proveedorId) {
      const mensajeError = "Debe seleccionar un proveedor";
      setError(mensajeError);
      return { ok: false, message: mensajeError };
    }

    setRegistrandoPago(true);
    setMensaje("");
    setError("");

    try {
      const respuesta = await registrarPagoCuentaCorrienteProveedor({
        proveedorId,
        fecha,
        descripcion,
        monto,
      });

      if (respuesta.ok) {
        setMensaje("Pago registrado correctamente");
        setSaldo(respuesta.saldo || 0);
        await cargarMovimientos(proveedorId);
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
                    <h3 className="mt-3 mb-2">Cuenta Corriente de Proveedores</h3>
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
                      clientes={proveedores}
                      clienteSeleccionado={proveedorSeleccionado}
                      busquedaCliente={busquedaProveedor}
                      onBusquedaClienteChange={setBusquedaProveedor}
                      onClienteChange={setProveedorSeleccionado}
                      onSubmit={handleRegistrarPago}
                      loading={registrandoPago}
                      loadingBusquedaClientes={cargandoProveedores}
                      errorBusquedaClientes={errorBusquedaProveedores}
                      labelBuscar="Buscar proveedor"
                      placeholderBusqueda="Ingrese al menos 3 caracteres"
                      labelEntidad="Proveedor"
                      entidadNombre="proveedor"
                      textoSeleccionEntidad="Seleccione un proveedor"
                      mensajeBusquedaActiva="Buscando proveedores..."
                    />
                  </div>
                  <div className="col-lg-8">
                    {proveedorSeleccionado ? (
                      <CuentaCorrienteTable
                        movimientos={movimientos}
                        saldoActual={saldo}
                        loading={cargandoMovimientos}
                        entidadLabel="Proveedor"
                        descripcionMovimientos="Las últimas facturas y pagos aparecen primero."
                        titulo="Resumen de operaciones"
                      />
                    ) : (
                      <div className="alert alert-light" role="alert">
                        Seleccione un proveedor para visualizar los movimientos.
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

export default CuentaCorrienteProveedores;
