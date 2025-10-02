import React, { useState, useEffect, useCallback } from "react";
import { getUltimacomandas } from "../helpers/rutaUltimacomandas";
import { addUltimacomanda } from "../helpers/rutaUltimacomandas";

function ActualizaComanda() {
  const [ultimacomandas, setUltimacomandas] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getUltimacomandas().then((ultima) => {
      setUltimacomandas({
        data: ultima,
        loading: false,
      });
    });
  }, []);

  var nrocomanda;

  if (!ultimacomandas.loading) {
    console.log("CANT REGISTROS", ultimacomandas.data.comandas.length);
    console.log(
      "NRO DE COMANDA",
      ultimacomandas.data.comandas[ultimacomandas.data.comandas.length - 1]
        .nrodecomanda
    );
    nrocomanda =
      ultimacomandas.data.comandas[ultimacomandas.data.comandas.length - 1]
        .nrodecomanda;

    addUltimacomanda({ nrodecomanda: nrocomanda + 1 });
  }

  return nrocomanda + 1;
}

export default ActualizaComanda;
