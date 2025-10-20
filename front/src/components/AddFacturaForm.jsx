import React, { useEffect, useState } from "react";
import { addFacturaCompra } from "../helpers/rutaFacturasCompra";
import { getProveedores } from "../helpers/rutaProveedores";
import "../css/addclienteform.css";

const obtenerFechaHoy = () => new Date().toISOString().split("T")[0];

const AddFacturaForm = ({ setShow }) => {
  const [formValues, setFormValues] = useState({
    numero: "",
    fecha: obtenerFechaHoy(),
    proveedor: "",
    monto: "",
  });

  const [proveedores, setProveedores] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getProveedores().then((resp) => {
      setProveedores({
        data: resp,
        loading: false,
      });
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizarMonto = (valor) => {
    if (valor === null || valor === undefined) {
      return 0;
    }

    const numero = Number(String(valor).replace(/,/g, "."));
    if (!Number.isFinite(numero)) {
      return 0;
    }

    return numero;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addFacturaCompra({
      ...formValues,
      monto: normalizarMonto(formValues.monto),
    }).then((resp) => {
      if (resp?.ok) {
        setFormValues({
          numero: "",
          fecha: obtenerFechaHoy(),
          proveedor: "",
          monto: "",
        });
        window.dispatchEvent(new Event("facturascompra:actualizada"));
      }
    });
  };

  return (
    <>
      {!proveedores.loading && (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group mt-3 col-sm-4">
                <label htmlFor="numero">Nro de Factura</label>
                <input
                  id="numero"
                  type="text"
                  className="form-control"
                  name="numero"
                  maxLength="30"
                  required
                  value={formValues.numero}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mt-3 col-sm-4">
                <label htmlFor="fecha">Fecha de la Factura</label>
                <input
                  id="fecha"
                  type="date"
                  className="form-control"
                  name="fecha"
                  required
                  value={formValues.fecha}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mt-3 col-sm-4">
                <label htmlFor="proveedor">Proveedor</label>
                <select
                  id="proveedor"
                  className="form-control"
                  name="proveedor"
                  value={formValues.proveedor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.data.proveedores
                    .filter((prov) => prov.activo)
                    .map((prov) => (
                      <option key={prov._id} value={prov._id}>
                        {prov.razonsocial}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group mt-3 col-sm-4">
                <label htmlFor="monto">Monto de la Factura</label>
                <input
                  id="monto"
                  type="number"
                  className="form-control"
                  name="monto"
                  min="0"
                  step="0.01"
                  required
                  value={formValues.monto}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark mt-3">
              Guardar Factura
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddFacturaForm;
