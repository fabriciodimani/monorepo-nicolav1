import React, { useContext, useEffect, useState } from "react";
import { ComandaContext } from "../Context/ComandaContext";

// import ComandaProvider from "../Context/ComandaContext";

// import { getComandas } from "../helpers/rutaComandas";
import Busqueda from "./Busqueda";
import TableComandas from "./TableComandas";

// import "bootstrap/dist/css/bootstrap.min.css";

const BarraBusqueda = () => {
  const { comandas } = useContext(ComandaContext);

  const [muestrapagina, setMuestrapagina] = useState(true);

  // const [comandas, setComandas] = useState({
  //   data: [],
  //   loading: true,
  // });

  const [comandasFiltradas, setComandasFiltradas] = useState([]);
  const [fechaInicioSelect, setFechaInicioSelect] = useState("");
  //   const [fechaFinSelect, setFechaFinSelect] = useState("");
  const [nrocomandaSelect, setNrocomandaSelect] = useState("");
  const [clienteSelect, setClienteSelect] = useState("");
  const [listaSelect, setListaSelect] = useState("");
  const [productoSelect, setProductoSelect] = useState("");

  // useEffect(() => {
  //   getComandas().then((comandas) => {
  //     setComandas({
  //       data: comandas,
  //       loading: false,
  //     });
  //   });
  // }, [comandasFiltradas]);

  const filtrarComandas = () => {
    const nrocomandaFilter = comandas.data.comandas.filter((comanda) => {
      return (
        nrocomandaSelect === "" ||
        comanda.nrodecomanda === parseInt(nrocomandaSelect)
      );
    });

    const clienteFilter = nrocomandaFilter.filter((comanda) => {
      return clienteSelect === "" || comanda.codcli._id === clienteSelect;
    });

    const listaFilter = clienteFilter.filter((comanda) => {
      return listaSelect === "" || comanda.lista._id === listaSelect;
    });

    const productoFilter = listaFilter.filter((comanda) => {
      return productoSelect === "" || comanda.codprod._id === productoSelect;
    });

    const fechaInicioFilter = productoFilter.filter((comanda) => {
      return (
        fechaInicioSelect === "" ||
        comanda.fecha.toLocaleString("en-GB").substr(0, 10) ===
          fechaInicioSelect
      );
    });

    setComandasFiltradas(fechaInicioFilter);
  };

  //   console.log(comandasFiltradas);

  return (
    <>
      <Busqueda
        setNrocomandaSelect={setNrocomandaSelect}
        setClienteSelect={setClienteSelect}
        setListaSelect={setListaSelect}
        setProductoSelect={setProductoSelect}
        setFechaInicioSelect={setFechaInicioSelect}
        filtrarComandas={filtrarComandas}
        setMuestrapagina={setMuestrapagina}
      />
      {!comandas.loading && (
        <TableComandas comandasFiltradas={comandasFiltradas} />
      )}
    </>
  );
};

export default BarraBusqueda;

// setInputValue={setInputValue}
// inputValue={inputValue}

// console.log(comanda.nrodecomanda);
// console.log(comanda.codcli.razonsocial);
// console.log(comanda.lista.lista);
// console.log(comanda.codprod.descripcion);

// {comandasFiltradas.map((comanda) => {

//     return (<TableComandas />)
//   })}
