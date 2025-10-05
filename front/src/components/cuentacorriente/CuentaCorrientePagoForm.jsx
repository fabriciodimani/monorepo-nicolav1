import React, { useEffect, useState } from "react";

const initialDate = () => new Date().toISOString().split("T")[0];

const CuentaCorrientePagoForm = ({
  clientes = [],
  selectedClienteId,
  onClienteChange = () => {},
  onSubmit,
  loading,
  saldoActual,
}) => {
  const [formValues, setFormValues] = useState({
    clienteId: selectedClienteId || "",
    fecha: initialDate(),
    descripcion: "",
    monto: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setFormValues((prev) => ({ ...prev, clienteId: selectedClienteId || "" }));
  }, [selectedClienteId]);

  const handleChange = ({ target: { name, value } }) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formValues.clienteId) {
      setError("Debe seleccionar un cliente");
      return;
    }

    const montoNumber = Number(formValues.monto);

    if (Number.isNaN(montoNumber) || montoNumber <= 0) {
      setError("El monto debe ser un número mayor a cero");
      return;
    }

    try {
      await onSubmit({
        clienteId: formValues.clienteId,
        fecha: formValues.fecha,
        descripcion: formValues.descripcion,
        monto: montoNumber,
      });

      setFormValues((prev) => ({
        ...prev,
        descripcion: "",
        monto: "",
      }));
    } catch (submitError) {
      setError(
        submitError?.message || "No se pudo registrar el pago. Intente nuevamente"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h5 className="mb-3">Registrar pago</h5>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="clienteId">Cliente</label>
          <select
            id="clienteId"
            name="clienteId"
            className="form-control"
            value={formValues.clienteId}
            onChange={(event) => {
              handleChange(event);
              onClienteChange(event.target.value);
            }}
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.razonsocial}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group col-md-3">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            className="form-control"
            value={formValues.fecha}
            onChange={handleChange}
            max={initialDate()}
          />
        </div>
        <div className="form-group col-md-3">
          <label htmlFor="monto">Monto</label>
          <input
            type="number"
            id="monto"
            name="monto"
            className="form-control"
            min="0"
            step="0.01"
            value={formValues.monto}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          className="form-control"
          rows="2"
          value={formValues.descripcion}
          onChange={handleChange}
          placeholder="Detalle del pago"
        />
      </div>
      {typeof saldoActual === "number" && formValues.clienteId && (
        <p className="font-weight-bold">
          Saldo actual: {saldoActual.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </p>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Guardando..." : "Registrar pago"}
      </button>
    </form>
  );
};

export default CuentaCorrientePagoForm;
