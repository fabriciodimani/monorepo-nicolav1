import React, { useEffect, useState } from "react";

const obtenerFechaHoy = () => new Date().toISOString().split("T")[0];

const CuentaCorrientePagoForm = ({
  clientes = [],
  clienteSeleccionado = "",
  onClienteChange,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    clienteId: clienteSeleccionado || "",
    fecha: obtenerFechaHoy(),
    descripcion: "",
    monto: "",
  });

  const [errores, setErrores] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      clienteId: clienteSeleccionado || "",
    }));
  }, [clienteSeleccionado]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores("");

    if (name === "clienteId" && typeof onClienteChange === "function") {
      onClienteChange(value);
    }
  };

  const validar = () => {
    if (!formData.clienteId) {
      setErrores("Debe seleccionar un cliente");
      return false;
    }

    const monto = Number(formData.monto);
    if (Number.isNaN(monto) || monto <= 0) {
      setErrores("El monto debe ser un número mayor a cero");
      return false;
    }

    const fecha = new Date(formData.fecha);
    if (Number.isNaN(fecha.getTime())) {
      setErrores("La fecha seleccionada no es válida");
      return false;
    }

    setErrores("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validar()) {
      return;
    }

    if (typeof onSubmit !== "function") {
      return;
    }

    const resultado = await onSubmit({
      clienteId: formData.clienteId,
      fecha: formData.fecha,
      descripcion: formData.descripcion,
      monto: formData.monto,
    });

    if (resultado?.ok) {
      setFormData((prev) => ({
        ...prev,
        descripcion: "",
        monto: "",
        fecha: obtenerFechaHoy(),
      }));
    } else if (resultado?.message) {
      setErrores(resultado.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm">
      <div className="card-body d-flex flex-column gap-3">
        <h5 className="card-title">Registrar pago</h5>
        <div className="form-group mb-3">
          <label htmlFor="clienteId">Cliente</label>
          <select
            id="clienteId"
            name="clienteId"
            className="form-control"
            value={formData.clienteId}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.razonsocial}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            className="form-control"
            value={formData.fecha}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            className="form-control"
            placeholder="Detalle del pago"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="monto">Monto</label>
          <input
            type="number"
            min="0"
            step="0.01"
            id="monto"
            name="monto"
            className="form-control"
            placeholder="0.00"
            value={formData.monto}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {errores && (
          <div className="alert alert-danger" role="alert">
            {errores}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar pago"}
        </button>
      </div>
    </form>
  );
};

export default CuentaCorrientePagoForm;
