import React, { useState, useEffect } from "react";

// import Comandas from "../components/comanda";

import { getComandas } from "../helpers/rutaComandas";

const GetNrodeComanda = () => {
  const [comanda, setComanda] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getComandas().then((comandas) => {
      setComanda({
        data: comandas,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!comanda.loading && (
        <>
          {/* {comanda.data.comandas.map((comanda) =>
            console.log(comanda.nrodecomanda)
          )} */}
          {console.log(
            comanda.data.comandas[comanda.data.comandas.length - 1].nrodecomanda
          )}

          {/* <Comandas
            datacomanda={
              comanda.data.comandas[comanda.data.comandas.length - 1]
                .nrodecomanda
            }
          /> */}
        </>
      )}
    </>
  );
};

export default GetNrodeComanda;
