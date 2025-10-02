import React, { useState, useEffect } from "react";
import { getInvoiceId } from "../helpers/rutaInvoice";
import { getClienteId } from "../helpers/rutaClientes";
import { getLocalidadId } from "../helpers/rutaLocalidades";
import { getProvinciasId } from "../helpers/rutaProvincias";
import GetDataProducServ from "./GetDataProducServ";

const GetDataInvoiceAdmin = (props) => {
  let nrocomanda = props.datacomanda;

  const [invoice, setInvoice] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getInvoiceId(nrocomanda).then((invoice) => {
      setInvoice({
        data: invoice,
        loading: false,
      });
    });
  }, []);

  let nrocliente = props.datacodcli;

  const [cliente, setCliente] = useState({
    data: {},
    loading: true,
  });

  const [localidad, setLocalidad] = useState({
    data: {},
    loading: true,
  });

  const [provincia, setProvincia] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    if (nrocliente !== "" && nrocliente !== null) {
      getClienteId(nrocliente).then((cliente) => {
        setCliente({ data: cliente, loading: false });
        getLocalidadId(cliente.clientes.localidad).then((localidad) => {
          setLocalidad({
            data: localidad,
            loading: false,
          });
          getProvinciasId(localidad.localidades.provincia).then((provincia) => {
            setProvincia({
               data: { ...cliente, ...localidad, ...provincia },
              loading: false,
            });
          });
          // }
        });
      });
    }
  }, []);

  return (
    <>
      {!invoice.loading &&
        !cliente.loading &&
        !localidad.loading &&
        !provincia.loading && (
          <GetDataProducServ
            data={invoice.data.comanda}
            datacli={provincia.data.clientes}
            datalocal={provincia.data.localidades}
            dataprov={provincia.data.provincias}
          />
        )}
    </>
  );
};

export default GetDataInvoiceAdmin;