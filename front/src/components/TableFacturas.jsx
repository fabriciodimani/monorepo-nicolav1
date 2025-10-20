import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import {
  deleteFacturaCompra,
  getFacturaCompraId,
  getFacturasCompra,
} from "../helpers/rutaFacturasCompra";
import ModalFactura from "./ModalFactura";
import "../css/tablefacturas.css";

const formatCurrency = (valor) => {
  const numero = Number(valor) || 0;
  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

const formatDate = (valor) => {
  if (!valor) {
    return "";
  }

  const date = new Date(valor);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const TableFacturas = () => {
  const [facturas, setFacturas] = useState({
    data: {},
    loading: true,
  });

  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [show, setShow] = useState(false);

  const cargarFacturas = useCallback(() => {
    getFacturasCompra().then((resp) => {
      setFacturas({
        data: resp,
        loading: false,
      });
    });
  }, []);

  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);

  useEffect(() => {
    const handler = () => cargarFacturas();
    window.addEventListener("facturascompra:actualizada", handler);

    return () => {
      window.removeEventListener("facturascompra:actualizada", handler);
    };
  }, [cargarFacturas]);

  const handleClose = () => {
    setShow(false);
    cargarFacturas();
  };

  const handleShow = () => setShow(true);

  const editarFactura = (id) => {
    getFacturaCompraId(id).then((resp) => {
      setFacturaSeleccionada(resp);
      handleShow();
    });
  };

  const eliminarFactura = (id) => {
    const confirmar = window.confirm("¿Está seguro que desea eliminar la factura?");
    if (!confirmar) {
      return;
    }

    deleteFacturaCompra(id).then(() => {
      cargarFacturas();
    });
  };

  return (
    <div className="table-container facturas-table-wrapper">
      {!facturas.loading && (
        <>
          <div className="col-12 mt-4"></div>
          <div>
            <Table
              striped
              bordered
              hover
              responsive
              className="facturas-table"
            >
              <thead>
                <tr className="header">
                  <th className="numero">Nro de Factura</th>
                  <th className="fecha">Fecha</th>
                  <th className="proveedor">Proveedor</th>
                  <th className="monto">Monto</th>
                  <th className="acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.data?.facturas?.map((factura) => (
                  factura.activo && (
                    <tr key={factura._id}>
                      <td>{factura.numero}</td>
                      <td>{formatDate(factura.fecha)}</td>
                      <td>{factura.proveedor?.razonsocial || ""}</td>
                      <td>{formatCurrency(factura.monto)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => editarFactura(factura._id)}
                        >
                          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger ml-2"
                          onClick={() => eliminarFactura(factura._id)}
                        >
                          <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </Table>
          </div>
          <ModalFactura
            show={show}
            handleClose={handleClose}
            factura={facturaSeleccionada}
          />
        </>
      )}
    </div>
  );
};

export default TableFacturas;
