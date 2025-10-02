import React, { useState, useEffect } from "react";
import EasyInvoiceSample from "../report/Invoice";
import { getProducservId } from "../helpers/rutaProducservs";

const GetDataProducServ = (props) => {
  let aux = [];
  const [producserv, setProducserv] = useState({
    products: [],
    loading: true,
  });

  useEffect(() => {
    if (props.data !== undefined) {
      for (let i = 0; i < props.data.length; i++) {
        getProducservId(props.data[i].codprod).then((producserv) => {
          let temp = {
            quantity: props.data[i].cantidad,
            description: producserv.producservs.descripcion,
            'tax-rate': 0,
            price: props.data[i].monto,
            // subtotal:0,
          };

          aux.push(temp);
        });
      }
    }
    setProducserv({ products: aux, loading: false });
  }, []);


  let datoscli = {
    company: props.datacli.razonsocial,
    address: props.datacli.domicilio,
    zip: props.datalocal.codigopostal,
    city: props.datalocal.localidad,
    country: props.dataprov.provincia,
  };

  return (
    <>
      {!producserv.loading && (
        <EasyInvoiceSample
          data={producserv.products}
          datacli={datoscli}
          datacomanda={props.data}
        />
      )}
    </>
  );
};

export default GetDataProducServ;