import { createContext, useState, useEffect } from "react";
import { getComandas } from "../helpers/rutaComandas";

import axios from "axios";

// Creamos context

export const ComandaContext = createContext(); //linea obligatoria

// Creamos el provider context

const ComandaProvider = (props) => {
  //linea obligatoria

  // creamos el state del context
  const [comandas, setComandas] = useState([]);

  useEffect(() => {
    getComandas().then((comandas) => {
      setComandas({
        data: comandas,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      {!comandas.loading && (
        <ComandaContext.Provider value={{ comandas }}>
          {props.children}
        </ComandaContext.Provider>
      )}
    </>
  );
};

export default ComandaProvider;
