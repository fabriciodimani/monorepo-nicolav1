import React, { useState, useEffect } from "react";
import GetDataInvoiceAdmin from "../report/GetDataInvoiceAdmin";
import { getComandas, delComanda, getComandaId } from "../helpers/rutaComandas";
import { modifProducserv, getProducservId } from "../helpers/rutaProducservs";
import styled from "styled-components";
import { useTable, useBlockLayout } from "react-table";
import { useSticky } from "react-table-sticky";
import axios from "axios";
import _ from "lodash";
import Table from "./TableContainer";
// import { SelectColumnFilter } from "./Filter";
import ModalComanda from "../components/ModalComanda";
import ModalAsignar from "../components/ModalAsignar";
import { buildQueries } from "@testing-library/react";
import { TabContent } from "reactstrap";
// import "../css/tablecomandas.css";

// import "./App.css";

function AppPreventaReactTable() {
  const [edit, setEdit] = useState(false);
  const [coma, setComa] = useState(0);
  const [show, setShow] = useState(false);
  const [showMasivo, setShowMasivo] = useState(false);

  const [comandas, setComandas] = useState({
    data: {},
    loading: true,
  });
  const [comanda, setComanda] = useState({});
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   axios("http://localhost:3004/comandasactivas")
  //     .then((res) => {
  //       setData(res.data.comandas);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

var iduser = localStorage.getItem("id");

  useEffect(() => {
    // se hizo una api con comandas que tienen el filtro de preparadas
    axios
      .get("http://localhost:3004/comandasprev")
      .then((res) => {
        const filtro = res.data.comandas.filter(
          (tabla) => tabla.usuario === iduser
        );

        //setData(res.data.comandas);
        console.log(filtro);
        setData(filtro);
      })
      .catch((err) => console.log(err));
  }, []);

  const Styles = styled.div`
  sticky: true;  
  padding: 0rem;
  
  table {
    sticky: true;
    // background-color: #548fcd;
    color: var(--color-text-primary);
    border-spacing: 0;
    border: 1px solid var(--color-border-strong);
    font-size: 13px;
    z-index: 1;

    th {
      sticky: true;
      background-color: var(--color-status-info);
      font-size: 12px;
      text-align: center;
      height: 10rem;
      // position: sticky;
      color: var(--color-text-on-contrast);
      top: 100;
      z-index: 1;
    }
    ,
    td {
      sticky: true;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      // background-color: #548f0a;
      background-color: var(--color-surface-muted);
      font-size: 13px;
      // top: 100;
      // z-index: 1;
      

      :last-child {
        border-right: 0;
      }

      input {
        // sticky: true;
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 2;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
    background-color: var(--color-status-info);
    color: var(--color-text-on-contrast);
    font-size: 15px;
    font-weight: bold;
  }
  
  &.sticky {
    overflow: scroll;
    header,
    footer {
      position: sticky;
      z-index: 1;
      // width: fit-content;
    }
  }
    
    .header {
      top: 0;
      box-shadow: var(--shadow-soft);
      position: sticky;
      z-index:10;

    }

    [data-sticky-td] {
      // position: sticky;
      position: absolute;
      z-index: 0;
    }


`;


  // fn filtro fecha

  function dateBetweenFilterFn(rows, id, filterValues) {
    const sd = filterValues[0] ? new Date(filterValues[0]) : undefined;
    const ed = filterValues[1] ? new Date(filterValues[1]) : undefined;

    if (ed || sd) {
      return rows.filter((r) => {
        const cellDate = new Date(r.values[id]);

        if (ed && sd) {
          return cellDate >= sd && cellDate <= ed;
        } else if (sd) {
          return cellDate >= sd;
        } else if (ed) {
          return cellDate <= ed;
        }
      });
    } else {
      return rows;
    }
  }

  // filtro fecha
  function DateRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
  }) {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length
        ? new Date(preFilteredRows[0].values[id])
        : new Date(0);
      let max = preFilteredRows.length
        ? new Date(preFilteredRows[0].values[id])
        : new Date(0);

      preFilteredRows.forEach((row) => {
        const rowDate = new Date(row.values[id]);

        min = rowDate <= min ? rowDate : min;
        max = rowDate >= max ? rowDate : max;
      });

      return [min, max];
    }, [id, preFilteredRows]);

    return (
      <div>
        <input
          min={min.toISOString().slice(0, 10)}
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [val ? val : undefined, old[1]]);
          }}
          type="date"
          style={{
            width: "100px",
            marginRight: "0.5rem",
            marginBottom: "2.2rem",
          }}
          value={filterValue[0] || ""}
        />
        {/* {" a "} */}
        <input
          max={max.toISOString().slice(0, 10)}
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              old[0],
              val ? val.concat("T23:59:59.999Z") : undefined,
            ]);
          }}
          type="date"
          style={{
            width: "100px",
            marginRight: "0.5rem",
            marginBottom: "2.2rem",
          }}
          value={filterValue[1]?.slice(0, 10) || ""}
        />
      </div>
    );
  }

  const consultaComandas = () => {
    getComandas().then((datos) => {
      // console.log(datos);
      setComandas({
        data: datos,
        loading: false,
      });
    });
  };

  // LOGISTICA
  const modificaComanda = (nrodecomanda) => {
    // let id_comanda = id;

    const buscacomanda = data.filter(function (element) {
      return element.nrodecomanda === nrodecomanda;
    });
    console.log("buscacomanda", buscacomanda);

    setComanda(buscacomanda);

    handleShow();
  };

  // ASIGNAR MASIVO
  const asignaRutaMasivo = (idruta) => {
    // console.log("iduta", idruta);

    const buscaRuta = data.filter(function (element) {
      return (
        element.codcli.ruta._id === idruta &&
        element.codestado._id === "62200265c811f41820d8bda9"
      );
    });

    // console.log("BUSCA RUTA", buscaRuta);
    // debugger;

    if (buscaRuta.length === 0) {
      alert(
        "La asignacion masiva de rutas deben tener como estado A Preparar y Sin asignar Camion o Deposito"
      );
    } else {
      setComanda(buscaRuta);
      handleShowMasivo();
    }
  };

  const handleClose = () => {
    setShow(false);
    consultaComandas();
  };

  const handleCloseMasivo = () => {
    setShowMasivo(false);
    consultaComandas();
  };

  // HANDLE SHOWS
  const handleShow = () => setShow(true);

  const handleShowMasivo = () => setShowMasivo(true);

  //ELIMINAR COMANDA
  const deleteComanda = (nrodecomanda) => {
    console.log("com", data);
    console.log("nrodecomanda", nrodecomanda);

    const buscacomanda = data.filter(function (element) {
      return element.nrodecomanda === nrodecomanda;
    });
    console.log(buscacomanda);
    let validar = window.confirm(
      "está seguro que desea borrar la comanda Nro " + nrodecomanda
    );

    if (validar) {
      for (let i = 0; i < buscacomanda.length; i++) {
        delComanda(buscacomanda[i]._id).then((resp) => {
          // consultaComandas();
        });

        // aca suma cantidada + stock actual
        console.log("bc[i].cod._id", buscacomanda[i].codprod._id);
        // debugger;
        getProducservId(buscacomanda[i].codprod._id).then((stk) => {
          console.log("stk", stk);
          let resstk =
            parseInt(stk.producservs.stkactual) +
            parseInt(buscacomanda[i].cantidad);
          console.log("resstk", resstk);
          // debugger;
          modifProducserv(
            { stkactual: resstk },
            buscacomanda[i].codprod._id
          ).then((respuesta) => {
            console.log(respuesta);
            // debugger;
          });
        });
      }
      window.location.reload();
      // consultaComandas();
    }
  };
  //FIN ELIMINAR COMANDA

  // ARMADO DE COLUMNAS DE COMANDAS
  const columns = [
    {
      sticky: "left",
      id: "comanda",
      Header: "Com",
      width: "60",
      accessor: "nrodecomanda",
      filter: "equals",
      //alinea solo las celdas al centro
      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },
    {
      Header: "Cliente",
      accessor: "codcli.razonsocial",
      width: "100",
      sticky: "left",
    },
   

    {
      Header: "Producto",
      accessor: "codprod.descripcion",
      // sticky: "left",
    },
    {
      // sticky: "right",
      id: "fecha",
      width: "110",
      Header: "Fecha Comanda",
      style: { marginBottom: "2rem" },
      he: "200rem",
      // accessor: "fecha",
      accessor: (d) => `${d.fecha.slice(0, 10)}`,

      //alinea y corta la fecha y hora motrando solo fecha
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.value.slice(0, 10)}</div>
      ),

      Filter: DateRangeColumnFilter,
      // filter: "between",
      filter: dateBetweenFilterFn,
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      width: "80",
      filter: "equals",
      // id: "cantidad",

      // suma todas las celdas en el celda footer
      Footer: (info) => {
        // Only calculate total visits if rows change
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.cantidad + sum, 0),
          [info.rows]
        );

        // footer centrado y en negritas
        return (
          <>
            <div style={{ textAlign: "center" }}>
              <b className="pie">{total}</b>{" "}
            </div>
          </>
        );
      },

      // celda centrada
      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },

    {
      Header: "Cant Ent",
      accessor: "cantidadentregada",
      width: "80",

      filter: "equals",
      // id: "cantidad",

      // suma todas las celdas en el celda footer
      Footer: (info) => {
        // Only calculate total visits if rows change
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values.cantidadentregada + sum,
              0
            ),
          [info.rows]
        );

        // footer centrado y en negritas
        return (
          <>
            <div style={{ textAlign: "center" }}>
              <b className="pie">{total}</b>{" "}
            </div>
          </>
        );
      },

      Cell: (row) => <div style={{ textAlign: "center" }}>{row.value}</div>,
    },
    {
      Header: "Lista",
      accessor: "lista.lista",
      width: "80",
    },
    
    {
      Header: () => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          Precio Unitario
        </div>
      ),

      accessor: "monto",
      width: "100",

      Cell: (row) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(row.value)}
        </div>
      ),
    },

    {
      Header: "Total",
      id: "total",
      width: "100",
      accessor: (d) => `${d.cantidad}` * `${d.monto}`,
      // maxWidth: 200,

      Cell: (props) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(props.value),

      // totaliza en la celda footer el valor Total
      Footer: (info) => {
        // Only calculate total visits if rows change
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.total + sum, 0),
          [info.rows]
        );

        // convierte a formato moneda ARS
        return (
          <div style={{ textAlign: "right" }}>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(total)}
          </div>
        );
      },

      // Celdas hacia la derecha y con formato moneda arg
      Cell: (row) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(row.value)}
        </div>
      ),
    },
    {
      Header: "Total Ent",
      id: "totalentregada",
      accessor: (d) => `${d.cantidadentregada}` * `${d.monto}`,
      width: "100",
      // maxWidth: 200,

      Cell: (props) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(props.value),

      // totaliza en la celda footer el valor Total
      Footer: (info) => {
        // Only calculate total visits if rows change
        const totalentregada = React.useMemo(
          () =>
            info.rows.reduce((sum, row) => row.values.totalentregada + sum, 0),
          [info.rows]
        );

        // convierte a formato moneda ARS
        return (
          <div style={{ textAlign: "right" }}>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(totalentregada)}
          </div>
        );
      },

      // Celdas hacia la derecha y con formato moneda arg
      Cell: (row) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(row.value)}
        </div>
      ),
    },


    {
      Header: "Estado",
      accessor: "codestado.estado",
      width: "100",
    },
    {
      Header: "Ruta",
      accessor: "codcli.ruta.ruta",
      width: "100",
    },
    {
      Header: "Camionero",
      accessor: "camionero.nombres",
      width: "100",
    },
   
    {
      Header: "Punto Dist",
      accessor: "camion.camion",
      width: "100",
    },
    // {
    //   Header: "Usuario",
    //   accessor: "usuario.nombres",
    //   width: "100",
    // },

    
   
    // {
    //   Header: "Asignar Masivo",
    //   width: "70",

    //   // accessor: "modifica",
    //   Cell: (row) => (
    //     <div style={{ textAlign: "center" }}>
    //       <button
    //         id="acepto"
    //         className="btn btn-dark"
    //         onClick={(e) => asignaRutaMasivo(row.row.original.codcli.ruta._id)}
    //       >
    //         <i className="fa fa-truck" aria-hidden="true" color="white"></i>
    //       </button>
    //       {/* <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} /> */}
    //     </div>
    //   ),
    // },

    // {
    //   Header: "Logistica",
    //   width: "70",
    //   // accessor: "modifica",

    //   Cell: (row) => (
    //     <div style={{ textAlign: "center" }}>
    //       <button
    //         id="acepto"
    //         className="btn btn-primary"
    //         onClick={(e) => modificaComanda(row.row.original.nrodecomanda)}
    //       >
    //         <i
    //           className="fa fa-pencil-square-o"
    //           aria-hidden="true"
    //           color="white"
    //         ></i>
    //       </button>
    //       {/* <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} /> */}
    //     </div>
    //   ),
    // },

    // {
    //   Header: "Eliminar",
    //   width: "70",
    //   // accessor: "elimina",
    //   Cell: (row) => (
    //     <div style={{ textAlign: "center" }}>
    //       <button
    //         id="acepto"
    //         className="btn btn-danger"
    //         onClick={(e) => deleteComanda(row.row.original.nrodecomanda)}
    //       >
    //         <i className="fa fa-trash-o" aria-hidden="true" color="white"></i>
    //       </button>
    //       {/* <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} /> */}
    //     </div>
    //   ),
    // },

    {
      Header: "Imprimir",
      width: "70",
      // accessor: "impresion",
      Cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {/* <button id="acepto" className="btn btn-primary" onClick={(e) => modificaComanda(row.row.original._id)}>
          <i className="fa fa-pencil-square-o" aria-hidden="true" ></i>
        </button> */}
          <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} datacodcli={row.row.original.codcli._id} />
        </div>
      ),
    },
  ];

  return (
    <>
      <h1>
        <center>Preventas</center>
      </h1>
      <Styles className="table sticky" style={{ width: "auto", height: 400 }}>
        <div className="App">
          <Table columns={columns} data={data} />
        </div>
        <ModalComanda show={show} handleClose={handleClose} comanda={comanda} />
        <ModalAsignar
          show={showMasivo}
          handleClose={handleCloseMasivo}
          comanda={comanda}
        />
        {/* <ModalRuta show={show} handleClose={handleClose} comanda={comanda} /> */}
      </Styles>
    </>
  );
}

export default AppPreventaReactTable;
