import React, { useState, useEffect, useRef } from "react";
import { getComandas, delComanda, modifComanda } from "../helpers/rutaComandas";
import { modifProducserv, getProducservId } from "../helpers/rutaProducservs";
import styled from "styled-components";
import axios from "axios";
import _ from "lodash";
import Table from "./TableContainer";
import ModalComanda from "../components/ModalComanda";
import ModalAsignar from "../components/ModalAsignar";
import "../css/tablecomandas.css";


function AppGestionReactTable() {
  const [showDatesRange, setShowDatesRange] = useState(false);
  const [show, setShow] = useState(false);
  const [showMasivo, setShowMasivo] = useState(false);
  var arrayComandas = [];

  const [comandas, setComandas] = useState({
    data: {},
    loading: true,
  });
  const [comanda, setComanda] = useState({});
  const [data, setData] = useState([]);
  const [carga, setCarga] = useState(false);
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const getRangeFechas = () => {
    // const valor = document.getElementById('form-valor').value;
    setFechaDesde(document.getElementById('inputdesde').value);
    setFechaHasta(document.getElementById('inputhasta').value);
    setShowDatesRange(true);
    // if (setFechaDesde <= setFechaHasta  || !setFechaDesde || !setFechaHasta){
    //     setShowDatesRange(true)
    // } else {alert(' Debe Ingresar preriodos correctos')}
  }

  useEffect(() => {
    // axios("http://localhost:3004/comandasactivas")
    // axios('http://localhost:3004/comandasactivas?fecha=2022-08-03T21:00:00.949Z')
    // backditripollo.us-3.evennode.com
    axios.get('http://localhost:3004/comandasnro', {
      params: {
        // fechaDesde: '2022-11-03T00:00:00.000Z',
        // fechaHasta: '2022-11-07T23:59:59.000Z',
        fechaDesde: fechaDesde,
        fechaHasta: `${fechaHasta}T23:59:59.000Z`,
        // fecha: '2022-08-03T21:14:24.896Z',
        // nrodecomanda: 5,
      }
    })
      .then((res) => {
        setData(res.data.comandas);
        setCarga(true);
      })
      .catch((err) => console.log(err));
  }, [fechaDesde, fechaHasta]);

  const Styles = styled.div`
    sticky: true;
    padding: 0rem;

    table {
      sticky: true;
      color: black;
      border-spacing: 0;
      border: 1px solid black;
      font-size: 13px;
      z-index: 1;

      th {
        sticky: true;
        background-color: #607d8b;
        font-size: 12px;
        text-align: center;
        height: 10rem;
        // position: sticky;
        top: 100;
        z-index: 1;
      }
      ,
      td {
        sticky: true;
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        background-color: #d6d2b3;
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
      background-color: #607d8b;
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
      box-shadow: 0px 3px 3px #ccc;
      position: sticky;
      z-index: 10;
    }

    [data-sticky-td] {
      // position: sticky;
      position: absolute;
      z-index: 0;
    }
  `;

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
      setComandas({
        data: datos,
        loading: false,
      });
    });
  };

  const handleClose = () => {
    setShow(false);
    consultaComandas();
  };

  // LOGISTICA
  const modificaComanda = (nrodecomanda) => {
    const buscacomanda = data.filter(function (element) {
      return element.nrodecomanda === nrodecomanda;
    });
    setComanda(buscacomanda);
    handleShow();
  };


  // HANDLE SHOWS
  const handleShow = () => setShow(true);

  const handleShowMasivo = () => setShowMasivo(true);

//ELIMINAR COMANDA
const deleteComanda = async (nrodecomanda) => {
  const buscacomanda = data.filter(function (element) {
    return element.nrodecomanda === nrodecomanda;
  });
  // Busca comandas CERRADAS
  const soloComandasCerradas = buscacomanda.filter(function (element) {
    return element.codestado._id === '62bce5cc8290be0033754f24'; // Estado CERRADA
  });
  // console.log(buscacomanda);
  // console.log(soloComandasCerradas);
  // verifica que las comandas NO pertenezcan a estado CERRADA
  if (soloComandasCerradas.length === 0) {
    let validar = window.confirm(
      "Está seguro que desea borrar la comanda Nro: " + nrodecomanda
    );
    if (validar) {
      for (let i = 0; i < buscacomanda.length; i++) {
        await delComanda(buscacomanda[i]._id).then((resp) => {
          if (!resp.ok) alert('Hubo un error al eliminar... Verifique...')
        });
        // aqui suma cantidada + stock actual
        await getProducservId(buscacomanda[i].codprod._id).then((stk) => {
          let resstk =
            parseInt(stk.producservs.stkactual) +
            parseInt(buscacomanda[i].cantidad);
          modifProducserv(
            { stkactual: resstk },
            buscacomanda[i].codprod._id
          ).then((respuesta) => {
            if (!respuesta.ok) alert('Hubo un error al actualizar stock... Verifique...')
          });
        });
      }
      window.location.reload();
    }
  } else alert ("Las comandas que fueron CERRADAS no se podran eliminar...")
};



  const columns = [
    {
      sticky: "left",
      id: "comanda",
      Header: "Com",
      width: "60",
      accessor: "nrodecomanda",
      filter: "equals",
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
    },
    {
      id: "fecha",
      width: "110",
      Header: "Fecha Comanda",
      style: { marginBottom: "2rem" },
      he: "200rem",
      accessor: (d) => `${d.fecha.slice(0, 10)}`,

      Cell: (row) => (
        <div style={{ textAlign: "center" }}>{row.value.slice(0, 10)}</div>
      ),

      Filter: DateRangeColumnFilter,
      filter: dateBetweenFilterFn,
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      width: "80",
      filter: "equals",
      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.cantidad + sum, 0),
          [info.rows]
        );
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
      Header: "Cant Ent",
      accessor: "cantidadentregada",
      width: "80",

      filter: "equals",
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.rows.reduce(
              (sum, row) => row.values.cantidadentregada + sum,
              0
            ),
          [info.rows]
        );
        return (
          <>
            <div style={{ textAlign: "center" }}>
              <b className="pie1">{total}</b>{" "}
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
      width: "150",
      accessor: (d) => `${d.cantidad}` * `${d.monto}`,

      Cell: (props) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(props.value),
      Footer: (info) => {
        const total = React.useMemo(
          () => info.rows.reduce((sum, row) => row.values.total + sum, 0),
          [info.rows]
        );
        return (
          <div className="pie" style={{ textAlign: "right" }}>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(total)}
          </div>
        );
      },

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
      width: "150",

      Cell: (props) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(props.value),

      Footer: (info) => {
        const totalentregada = React.useMemo(
          () =>
            info.rows.reduce((sum, row) => row.values.totalentregada + sum, 0),
          [info.rows]
        );

        return (
          <div className="pie1" style={{ textAlign: "right" }}>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              color: "red",
            }).format(totalentregada)}
          </div>
        );
      },

      Cell: (row) => (
        <div style={{ textAlign: "right" }}>
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            color: "red",
          }).format(row.value)}
        </div>
      ),
    },

    {
      Header: "Estado",
      id: "Estado",
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

    {
      Header: "Usuario",
      accessor: "usuario.nombres",
      width: "100",
    },

    {
      Header: "Logistica",
      width: "70",

      Cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <button
            id="acepto"
            className="btn btn-primary"
            onClick={(e) => modificaComanda(row.row.original.nrodecomanda)}
          >
            <i
              className="fa fa-pencil-square-o"
              aria-hidden="true"
              color="white"
            ></i>
          </button>
        </div>
      ),
    },

    // {
    //   Header: "Imprimir",
    //   width: "70",

    //   Cell: (row) => (
    //     <div style={{ textAlign: "center" }}>
    //        <GetDataInvoiceAdmin datacomanda={row.row.original.nrodecomanda} datacodcli={row.row.original.codcli._id} />
    //     </div>
    //   ),
    // },

    {
      Header: "Eliminar",
      width: "70",

      Cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <button
            id="acepto"
            className="btn btn-danger"
            onClick={(e) => deleteComanda(row.row.original.nrodecomanda)}
          >
            <i className="fa fa-trash-o" aria-hidden="true" color="white"></i>
          </button>
        </div>
      ),
    },


  ];

  return (
    <>
      {!showDatesRange &&
        <form>
          <div className="row justify-content-center">
            <div className="col-6">
              <h3 className="mt-3">INGRESE PERIODO - 
                Desde: <input 
                        type="date" 
                        name="fdesde" 
                        id="inputdesde" 
                        required 
                        /> -
                Hasta: <input 
                        type="date" 
                        name="fhasta" 
                        id="inputhasta" 
                        required/>
              </h3>
            </div>
            <div className="col-2">
              <button 
                className="btn btn-danger ml-5 mt-2 mb-2 justify-content-end" 
                onClick={() => getRangeFechas()}> Aceptar </button>
              </div>
          </div>  
        </form>}
       
      {showDatesRange &&
        <>
          {!carga && <h2 className="cargando mt-3 ml-5"> Cargando... Espere...</h2>}
            <div className="row justify-content-center">
              <div className="col-8">
                <h1 className="mt-3">CONTROL DE GESTION  -  Desde: {fechaDesde} - Hasta: {fechaHasta}</h1>
              </div>
              <div className="col-2">
                <button          
                  className="btn btn-danger ml-5 mt-2 mb-2 justify-content-end"    
                  onClick={() => window.location.reload()}
                >
                Recargar Pagina...
                </button>
              </div>
            </div>
            <Styles className="table sticky" style={{ width: "auto", height: 900 }}>
              <div className="App">
                { fechaDesde > fechaHasta || fechaDesde === "" || fechaHasta === "" || fechaDesde === null || fechaHasta === null
                  ? <div>
                      {alert ('Debe Ingresar Periodos Correctos...')}
                      {window.location.reload()}
                    </div> 
                   : <Table columns={columns} data={data} />
                }
              </div>
              <ModalComanda show={show} handleClose={handleClose} comanda={comanda} />
            </Styles>
        </>
      }
    </>
  );
}

export default AppGestionReactTable;
