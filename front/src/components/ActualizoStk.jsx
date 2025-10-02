import React, { useState, useEffect } from "react";
import { getComandas } from "../helpers/rutaComandas";
import { getComandasdos } from "../helpers/rutaComandas";

import { getProducservs } from "../helpers/rutaProducservs";
import { getProducservId } from "../helpers/rutaProducservs";
import { modifProducserv } from "../helpers/rutaProducservs";

function ActualizoStk () {

  console.log("ESTOY ACTSTK");
  const [comandaact, setComandaact] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getComandas().then((comandas) => {
      setComandaact({
        data: comandas,
        loading: false,
      });
    });
  }, []);

  const [producservs, setProducservs] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getProducservs().then((producservs) => {
      setProducservs({
        data: producservs,
        loading: false,
      });
    });
  }, []);

  console.log("loading prod",producservs.loading);
  console.log("loading",comandaact.loading);
  debugger

  if (!comandaact) {
    let nrocom = parseInt(localStorage.getItem("nrodecomanda"));
    console.log("Tengo Nro Comanda",nrocom)
    debugger
    //   let nro = comanda.data.comandas.length
    const filtercomanda = comandaact.data.comandas.filter(function (element) {
      return element.nrodecomanda === nrocom;
    });
    console.log(filtercomanda.length);
    
    for (let i = 0; i < filtercomanda.length; i++) {
    getProducservId(filtercomanda[i].codprod._id).then((stk) => {
      console.log(filtercomanda[i].codprod._id);
      let resstk = parseInt(stk.producservs.stkactual) - parseInt(filtercomanda[i].cantidad);
      // let resstk = 10
      modifProducserv({ stkactual: resstk }, filtercomanda[i].codprod._id).then(
        (respuesta) => {
          console.log(respuesta);
        }
      );
    });
    }
}

  return (
    <>
      {/* {console.log(filterultimacomanda)} */}
    </>
  );
};

export default ActualizoStk;
