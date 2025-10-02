import React, { useState, useEffect } from "react";
import { getClientes } from "../helpers/rutaClientes";
import { getListas } from "../helpers/rutaListas";
import { getProducservs } from "../helpers/rutaProducservs";
import TableComandas from "./TableComandas";

//import "../css/busqueda.css";
const Busqueda = ({
  setNrocomandaSelect,
  setClienteSelect,
  setListaSelect,
  setProductoSelect,
  setFechaInicioSelect,
  setMuestrapagina,
  filtrarComandas,
}) => {
  // const handleChange = (e) => {

  // };

  const [clientes, setClientes] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getClientes().then((clientes) => {
      setClientes({
        data: clientes,
        loading: false,
      });
    });
  }, []);

  const [listas, setListas] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getListas().then((listas) => {
      setListas({
        data: listas,
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

  const handleSubmit = (e) => {
    // El preventDefault evita que se recargue la pagina en el onSubmit.
    e.preventDefault();
    // <Link to="/propiedades" className="nav-link"></Link>
    setMuestrapagina(false);
    filtrarComandas();
    // <TableComandas />;
  };
  return (
    <div className="busqueda">
      <div className="col-12">
        {/* <input
        type="text"
        className="form-control"
        placeholder="Busqueda..."
        // value={inputValue}
        // onChange={handleChange}
      /> */}
        <form class="form-inline">
          {/* COMANDA */}
          <h4 class="my-1 mr-1" for="inlineFormCustomSelectPref">
            Com:
          </h4>
          <input
            class="custom-select my-1 mr-sm-2"
            id="inlineFormCustomSelectPref"
            name="nrodecomanda"
            onChange={(e) => setNrocomandaSelect(e.target.value)}
          />

          {/* CLIENTE */}
          <h4 class="my-1 mr-2" for="inlineFormCustomSelectPref">
            Cliente:
          </h4>
          <select
            class="custom-select my-1 mr-sm-2"
            id="inlineFormCustomSelectPref"
            onChange={(e) => setClienteSelect(e.target.value)}
          >
            <option selected value="">
              Elija la opción adecuada
            </option>

            {!clientes.loading && (
              <>
                {clientes.data.clientes.map((cliente) => (
                  <option value={cliente._id}> {cliente.razonsocial} </option>
                ))}
              </>
            )}
          </select>

          {/* LISTA */}

          <h4 class="my-1 mr-2" for="inlineFormCustomSelectPref">
            Lista:
          </h4>
          <select
            class="custom-select my-1 mr-sm-2"
            id="inlineFormCustomSelectPref"
            onChange={(e) => setListaSelect(e.target.value)}
          >
            <option selected value="">
              Elija la opción adecuada
            </option>

            {!listas.loading && (
              <>
                {listas.data.listas.map((lista) => (
                  <option value={lista._id}> {lista.lista} </option>
                ))}
              </>
            )}
          </select>

          {/* PRODUCTO */}

          <h4 class="my-1 mr-2" for="inlineFormCustomSelectPref">
            Prod:
          </h4>
          <select
            class="custom-select my-1 mr-sm-2"
            id="inlineFormCustomSelectPref"
            onChange={(e) => setProductoSelect(e.target.value)}
          >
            <option selected value="">
              Elija la opción adecuada
            </option>

            {!producservs.loading && (
              <>
                {producservs.data.producservs.map((producto) => (
                  <option value={producto._id}> {producto.descripcion} </option>
                ))}
              </>
            )}
          </select>

          {/* FECHA */}
          <h4 class="my-1 mr-2" for="inlineFormCustomSelectPref">
            Fecha:
          </h4>
          <input
            type="date"
            class="custom-select my-1 mr-sm-2"
            id="inlineFormCustomSelectPref"
            name="nrodecomanda"
            onChange={(e) =>
              setFechaInicioSelect(
                e.target.value.toLocaleString("en-GB").substr(0, 10)
              )
            }
          />

          <button
            type="submit"
            class="btn btn-dark ml-3 my-1 btn-lg"
            onClick={handleSubmit}
          >
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
};
export default Busqueda;

// inputValue,
// setInputValue,
