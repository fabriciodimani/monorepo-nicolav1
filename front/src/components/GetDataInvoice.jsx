import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import easyinvoice from "easyinvoice";
import { getInvoiceId } from "../helpers/rutaInvoice";
import { getClienteId } from "../helpers/rutaClientes";
import { getLocalidadId } from "../helpers/rutaLocalidades";
import { getProvinciasId } from "../helpers/rutaProvincias";
import GetDataProducServ from "../report/GetDataProducServ";

// import logo from "../images/avicola.jpeg";

const GetDataInvoice = () => {
  let nrocomanda = parseInt(localStorage.getItem("nrodecomanda"), 10);

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

  let nrocliente = localStorage.getItem("codcli");

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

  // acumula todo en provincia a la hora de grabar los datos - Comienza con el nro de cliente
  // luego busca la localidad y finalmente x la provincia

  useEffect(() => {
    console.log(nrocliente);
    if (nrocliente !== "") {
      getClienteId(nrocliente).then((cliente) => {
        setCliente({ data: cliente, loading: false });
        //console.log(cliente.clientes.localidad);
        getLocalidadId(cliente.clientes.localidad).then((localidad) => {
          setLocalidad({
            // data: { ...cliente, ...localidad },
            data: localidad,
            loading: false,
          });
          // console.log(localidad.localidades.provincia);
          // if (provincia.data != null) {
          getProvinciasId(localidad.localidades.provincia).then((provincia) => {
            setProvincia({
              //data: provincia,
              //Spread Operator para juntar los objetos cliente, localidad y provincia
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

export default GetDataInvoice;

// datacli={cliente.data.clientes}
// console.log(invoice.data.comanda)
