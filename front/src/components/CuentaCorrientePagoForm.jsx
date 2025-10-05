import React, { useEffect, useMemo, useState } from "react";

const obtenerFechaHoy = () => new Date().toISOString().split("T")[0];

const CuentaCorrientePagoForm = ({
  clientes,
  selectedClienteId,
  onSubmit,
  loading,
}) => {
  const fechaHoy = useMemo(() => obtenerFechaHoy(), []);
  const [formValues, setFormValues] = useState({
    clienteId: selectedClienteId || "",
    fecha: fechaHoy,
    descripcion: "",
    monto: "",
  });

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      clienteId: selectedClienteId || "",
    }));
  }, [selectedClienteId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof onSubmit === "function") {
      const resultado = await onSubmit({
        ...formValues,
        monto: formValues.monto,
      });
      if (resultado) {
        setFormValues((prev) => ({
          ...prev,
          descripcion: "",
          monto: "",
          fecha: prev.fecha || fechaHoy,
        }));
      }
    }
  };

  const estaDeshabilitado =
    loading || !formValues.clienteId || Number(formValues.monto) <= 0;

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-row">
        <div className="form-group col-md-4">
          <label htmlFor="clienteId">Cliente</label>
          <select
            id="clienteId"
            name="clienteId"
            className="form-control"
            value={formValues.clienteId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.razonsocial}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group col-md-4">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            className="form-control"
            value={formValues.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group col-md-4">
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
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          className="form-control"
          placeholder="Detalle del pago"
          value={formValues.descripcion}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={estaDeshabilitado}>
        {loading ? "Registrando pago..." : "Registrar pago"}
      </button>
    </form>
  );
};

export default CuentaCorrientePagoForm;
