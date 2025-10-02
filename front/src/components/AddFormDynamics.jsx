/* eslint-disable no-unreachable */
/* eslint-disable no-loop-func */
import React, { useState, useEffect, Fragment } from "react";
import ActualizaComanda from "../components/ActualizaComanda";
import { addComanda } from "../helpers/rutaComandas";
import { getProducservId } from "../helpers/rutaProducservs";
import { modifProducserv } from "../helpers/rutaProducservs";
import { getComandas } from "../helpers/rutaComandas";
import { getClientes } from "../helpers/rutaClientes";
import { getListas } from "../helpers/rutaListas";
import { getUsuarios } from "../helpers/rutaUsuarios";
import { getProducservs } from "../helpers/rutaProducservs";
import { getPrecios } from "../helpers/rutaPrecios";
import "bootstrap/dist/css/bootstrap.css";
import "../css/addformdynamics.css";

const AddFormDynamics = (props) => {
  var comandaAsignada;

  // console.log(props.guardar);
  if (props.guardar) {
    comandaAsignada = ActualizaComanda();
    //localStorage.setItem("nrodecomanda", comandaAsignada);

    // console.log(ActualizaComandaFinal())
  }

  // {props.guardar && ActualizaComandaFinal()}

  const [totalacu, setTotalacu] = useState(0);

  const [comanda, setComanda] = useState({
    data: {},
    loading: true,
  });

  
  // useEffect(() => {
  //   getComandas().then((comandas) => {
  //     setComanda({
  //       data: comandas,
  //       loading: false,
  //     });
  //   });
  // }, []);

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

  const [usuarios, setUsuarios] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getUsuarios().then((usuarios) => {
      setUsuarios({
        data: usuarios,
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

  const [precio, setPrecio] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getPrecios().then((precio) => {
      setPrecio({
        data: precio,
        loading: false,
      });
    });
  }, []);

  const [grabar, setGrabar] = useState(false);

 
  var x = comandaAsignada;

  let totalcomanda = 0;

  console.log(x);

  const [inputFields, setInputFields] = useState([
    {
      nrodecomanda: localStorage.getItem("nrodecomanda"),
      codcli: localStorage.getItem("codcli"),
      lista: localStorage.getItem("lista"),
      usuario: localStorage.getItem("id"),
      codprod: "",
      cantidad: 1,
      monto: 0,
      stkactual: 0,
      codestado: "62200265c811f41820d8bda9", // Id A Preparar
      camion: "62c383381054f50033de00dc", //Id sin Asignar
      camionero: "62c381d31054f50033de00d9", // Id Camionero sin asignar
    },
  ]);

  // funcion que calcula el totalizador
  function totalizador(values) {
    //const values = [...inputFields];
    var acu = 0;
    for (let i = 0; i < values.length; i++) {
      acu = values[i].monto * values[i].cantidad + acu;
    }

    return acu;
  }

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({
      nrodecomanda: localStorage.getItem("nrodecomanda"),
      codcli: localStorage.getItem("codcli"),
      lista: localStorage.getItem("lista"),
      usuario: localStorage.getItem("id"),
      codprod: "",
      cantidad: 1,
      monto: 0,
      codestado: "62200265c811f41820d8bda9", // Id A Preparar
      camion: "62c383381054f50033de00dc", //Id sin Asignar
      camionero: "62c381d31054f50033de00d9", // Id Camionero sin asignar
    });

    console.log("Values", values);
    var band = false;
    for (var i = 0, max = values.length - 1; i < max; i += 1) {
      if (values[i].cantidad > 0) {
        band = true;
      } else band = false;

      if (!band)
        alert("Existen productos con cantidades menores que 1, verifique!");
    }
    if (band) {
      setInputFields(values);
      //console.log("TOTALIZADOR ADD: ", totalizador(values));
      setTotalacu(totalizador(values));
    }
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
    // console.log("TOTALIZADOR MENOS: ", totalizador(values));
    // console.log("VALUES MENOS", values);
    setTotalacu(totalizador(values));
  };

  const handleInputChange = (index, event) => {
    // const values1 = [...inputFields];
    // console.log(inputFields[index].codprod);
    // eslint-disable-next-line no-undef
    

    // console.log(findprod);

   
    
    const values = [...inputFields];
    if (event.target.name === "codprod") {
      values[index].codprod = event.target.value;
    }

    const precio1 = listaFilter.filter(function (element) {
      // return element.codproducto._id === "617b44f6deebc02e0c3e2090";
      return element.codproducto._id === values[index].codprod;
    });

    // console.log(precio1[0].preciototalventa);

    if (event.target.name === "cantidad") {
      values[index].cantidad = event.target.value;
    }
    console.log("valueindex", inputFields[index].cantidad);

    // const findprod = producservs.data.producservs.find(function (element) {
    //   return inputFields[index].codprod === element._id;
    // });

    // console.log(findprod.stkactual)



    if (
      values[index].codprod === null ||
      values[index].codprod === undefined ||
      values[index].codprod === ""
    ) {
      alert("Seleccione el producto");
    } else {
      
      values[index].monto = precio1[0].preciototalventa; // esprecio1 con indice 0 porque es el unico registro que devuelve
    }

    setInputFields(values);

    // console.log("TOTALIZADOR CHANGE: ", totalizador(values));
    setTotalacu(totalizador(values));

    // if (event.target.name === "monto") {
    // values[index].monto = event.target.value;
    // if (values[index].monto > 0) {

    // }
    // values[index].monto = "10";
    // }
  };

  // export default ActualizoStk;

  function ActualizoStk() {
    setGrabar(false);
    console.log("ESTOY ACTSTK");
    console.log(inputFields);
    // alert("La Comanda fue Grabada con exito");

    //comentar
    //if (!comanda.loading) {
      let nrocom = parseInt(localStorage.getItem("nrodecomanda"));
      console.log("Tengo Nro Comanda", nrocom);
      // debugger
      for (let i = 0; i < inputFields.length; i++) {
        console.log("CODPROD", inputFields[i].codprod);

        // if (!producservs.loading) {
        getProducservId(inputFields[i].codprod).then((stk) => {
          console.log(inputFields[i].codprod);
          let resstk = parseInt(stk.producservs.stkactual) - parseInt(inputFields[i].cantidad);
          // let resstk = 10
          // if (!producservs.loading) {
          console.log("resstk: ", resstk);
          // setTimeout(function(){
          //   console.log("Modificando.....");
          // }, 5000);
          //alert("holaaaa mundo")
          modifProducserv({ stkactual: resstk }, inputFields[i].codprod)
            .then((respuesta) => {
              console.log("RESPUESTA MODIFI", respuesta);
             // alert(respuesta);

            })
            .catch((err) => alert("No se pudo Grabar"));
            // setTimeout(function(){
            //   console.log("Modificando.....");
            // }, 5000);
          
          // }
        });
        // }
      }
   // }

    return (
      <>
        {alert("La Comanda fue Grabada con exito")} {setGrabar(false)}
      </>
    );
  }

  // Cuando GRABO la comanda:

  const handleSubmit = (e) => {
    // control de productos duplicados

    let valorArray = [];
    var save = false;
    var band = false;

    for (var i = 0, max = inputFields.length; i < max; i += 1) {
      //Entonces ahora validamos si el elemento está o no
      valorArray[i] = inputFields[i].codprod;
    }
    console.log("valorarray", valorArray);
    console.log("inputfields", inputFields);

    
    var count = {};
    valorArray.forEach(function (i) {
      count[i] = (count[i] || 0) + 1;
    });
    let aux;
    // console.log("veces", aux);
    aux = Object.values(count);
    console.log("cadena", aux);

    const found = aux.find((element) => parseInt(element) >= 2);

    console.log("encontrado:", found);

     // Busca si se supera el stock actual del producto
     for (let i = 0; i < inputFields.length; i++) {
      const findprod = producservs.data.producservs.find(function (element) {
      return inputFields[i].codprod === element._id;
    });
      console.log(findprod.stkactual);
      console.log(inputFields[i].cantidad);
     
      if (findprod.stkactual < inputFields[i].cantidad) {

        alert(`El producto ${findprod.descripcion} tiene ${findprod.stkactual} de existencia. Modifique cantidad..`);
        band = true;
      } 
    }

    // console.log(band);

    //  if (band) e.preventDefault();
   
    if (found >= 2 || band)  {
      // console.log("Se repite");
      // i = repiteArray.length;
      alert("Stock insuficiente o existen productos duplicados");
      e.preventDefault();
      // setGrabar(false);
      save = false;
    } else {
      for (var i = 0, max = inputFields.length; i < max; i += 1) {
        // inputFields[i].nrodecomanda = x + 1;
        inputFields[i].nrodecomanda = x;
      }

      for (var i = 0, max = inputFields.length; i < max; i += 1) {
        addComanda(inputFields[i]).then((resp) => {
          setInputFields({
            ...inputFields[i],
            [e.target.name]: e.target.value,
          });
          console.log("ADD COMANDA RESP", resp);
          // debugger;
        });
        // setGrabar(true);
        save = true;
      }
      // localStorage.setItem("nrodecomanda", x + 1);
      localStorage.setItem("nrodecomanda", x + 1);
    }
     
   // console.log(findprod.stkactual)

    // }
    return setGrabar(save);
  };

  let listaFilter = [];


  if (!precio.loading && !listas.loading && !producservs.loading) {
    
      listaFilter = precio.data.precios.filter(function (element) {
      console.log(element.codproducto);
      // console.log (localStorage.getItem("lista"))

      return element.lista._id === localStorage.getItem("lista");
      
    }
    

    
    );
    listaFilter.sort(function (a, b) {
      if (
        a.codproducto.descripcion.toLowerCase() <
        b.codproducto.descripcion.toLowerCase()
      )
        return -1;
      if (
        a.codproducto.descripcion.toLowerCase() >
        b.codproducto.descripcion.toLowerCase()
      )
        return 1;
      return 0;
    });
    
  }
  console.log(listaFilter);
  const listaFilterOrder = listaFilter => listaFilter.sort ((a,b) => a.codproducto.descripcion-b.codproducto.descripcion);

  var stkaux = 0;

  let stkaux1;

  return (
    <>
      <div className="container">
        <h4 className="normal mt-3 ml-3">
          COMANDA ASIGNADA: {comandaAsignada}
        </h4>
        <h5 className="normal mt-3 ml-3">
          PRODUCTOS/SERVICIOS CON STK ACTUAL CANTID P. UNITARIO PRECIO TOTAL
        </h5>
        <h5 className="responsive ml-3">
          PRODUCTOS/SERVICIOS__CANT P.UNITAR P.TOTAL
        </h5>
        {!clientes.loading &&
          !listas.loading &&
          !producservs.loading &&
          !precio.loading && (
            <form onSubmit={handleSubmit}>
              <div className="form-row col-md-6">
                {/* <div className="form-row"> */}
                {inputFields.map((inputField, index) => (
                  <Fragment key={`${inputField}~${index}`}>
                    <div className="form-group width">
                      <select
                        className="form-control"
                        id="codprod1"
                        name="codprod"
                        value={inputField.codprod}
                        onChange={(event) => handleInputChange(index, event)}
                        required
                      >
                        <option selected value="">
                          Elija opción
                        </option>

                        {listaFilter.map((producto) => (
                          <option value={producto.codproducto._id}>
                            {producto.codproducto.descripcion} STK:
                            {(stkaux = producto.codproducto.stkactual)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="cantidad1"
                        name="cantidad"
                        required
                        min="1"
                        maxLength="5"
                        value={inputField.cantidad}
                        // eslint-disable-next-line no-undef
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="monto1"
                        name="monto"
                        maxLength="10"
                        value={inputField.monto}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="total1"
                        name="total"
                        value={inputField.cantidad * inputField.monto}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        className="btn btn-danger mt-2"
                        id="masmenos1"
                        type="button"
                        onClick={() => handleRemoveFields(index)}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-success mt-2"
                        id="masmenos1"
                        type="button"
                        onClick={() => handleAddFields()}
                      >
                        +
                      </button>
                    </div>
                  </Fragment>
                ))}
              </div>

              {/* <div className="form-group ml-3">
                <label className="mt-4 mr-3 col-sm-1 offset-sm-3">TOTAL: </label>
                {totalacu}
               
              
              </div> */}
              <div className="container">
                <h3 className="mt-5 offset-sm-3">
                  TOTAL COMANDA: $ {totalacu}
                </h3>
              </div>
              <div className="container submit-button">
                <button
                  className="btn btn-dark mt-3 mb-3"
                  id="button"
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Guardar Comanda
                </button>
              </div>
            </form>
          )}
        {/* {props.guardar && ActualizaComanda()} */}
        {grabar && ActualizoStk()}

        {/* <h4>GENERAR EL PDF</h4> */}
      </div>
    </>
  );
};
export default AddFormDynamics;

// control de cantidades positivas

// for (var i = 0, max = inputFields.length; i < max; i += 1) {
//   if (inputFields[i].cantidad <= 0) {
//     i = inputFields.length;
//     alert("Existen productos con cantidades menores que 1, verifique!");
//     e.preventDefault();
//     setGrabar(false);
//   }
// }


// {listaFilter.map((producto) => (
//   <option value={producto.codproducto._id}>
//     {producto.codproducto.descripcion} STK:
//     {(stkaux = producto.codproducto.stkactual)}
//   </option>
// ))}