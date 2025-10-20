import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { updateFacturaCompra } from "../helpers/rutaFacturasCompra";
import { getProveedores } from "../helpers/rutaProveedores";
import "../css/addclienteform.css";

const formatearFechaInput = (fecha) => {
  if (!fecha) {
    return "";
  }

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

const ModalFormFactura = ({ factura, handleClose }) => {
  const facturaDatos = factura?.factura;

  const [formValues, setFormValues] = useState({
    numero: facturaDatos?.numero || "",
    fecha: formatearFechaInput(facturaDatos?.fecha),
    proveedor: facturaDatos?.proveedor?._id || facturaDatos?.proveedor || "",
    monto:
      facturaDatos?.monto !== undefined && facturaDatos?.monto !== null
        ? Number(facturaDatos.monto).toFixed(2)
        : "",
  });

  useEffect(() => {
    setFormValues({
      numero: facturaDatos?.numero || "",
      fecha: formatearFechaInput(facturaDatos?.fecha),
      proveedor: facturaDatos?.proveedor?._id || facturaDatos?.proveedor || "",
      monto:
        facturaDatos?.monto !== undefined && facturaDatos?.monto !== null
          ? Number(facturaDatos.monto).toFixed(2)
          : "",
    });
  }, [facturaDatos?.numero, facturaDatos?.fecha, facturaDatos?.proveedor, facturaDatos?.monto]);

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
    if (!facturaDatos?._id) {
      return;
    }

    updateFacturaCompra(
      {
        numero: formValues.numero,
        fecha: formValues.fecha,
        proveedor: formValues.proveedor,
        monto: normalizarMonto(formValues.monto),
      },
      facturaDatos._id
    )
      .then((resp) => {
        if (resp?.ok) {
          window.dispatchEvent(new Event("facturascompra:actualizada"));
          handleClose();
        } else {
          // eslint-disable-next-line no-alert
          window.alert("No se pudo guardar la factura. Inténtelo nuevamente.");
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        window.alert("Ocurrió un error al guardar la factura.");
      });
  };

  if (!facturaDatos) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Modal.Body>
        {!proveedores.loading && (
          <>
            <div className="form-group mt-3">
              <label htmlFor="numero">Nro de Factura</label>
              <input
                id="numero"
                type="text"
                className="form-control"
                name="numero"
                required
                value={formValues.numero}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
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

            <div className="form-group mt-3">
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

            <div className="form-group mt-3">
              <label htmlFor="monto">Monto</label>
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
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="dark">
          Guardar
        </Button>
      </Modal.Footer>
    </form>
  );
};

export default ModalFormFactura;
