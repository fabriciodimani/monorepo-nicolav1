import React, { useState, useEffect, Fragment } from "react";
import ReactDOM from "react-dom";
import { addRemito } from "../helpers/rutaRemitos";

import { getRemitos } from "../helpers/rutaRemitos";
import { getProveedores } from "../helpers/rutaProveedores";
import { getProducservs } from "../helpers/rutaProducservs";
import { getPrecios } from "../helpers/rutaPrecios";
import "bootstrap/dist/css/bootstrap.css";
import "../css/addremitoformdynamics.css";
const AddRemitoFormDynamics = () => {
  // Devuelve el ultimo nro de comanda
  // const Ultimonroderemito = function (numberremito) {
  //   const [remito, setRemito] = useState({
  //     data: {},
  //     loading: true,
  //   });

  //   useEffect(() => {
  //     getRemitos().then((remitos) => {
  //       setRemito({
  //         data: remitos,
  //         loading: false,
  //       });
  //     });
  //   }, []);

  //   return numberremito;
  // };

  // var x = Ultimonroderemito();

  // let totalremito=0;

  // console.log(x);

  console.log(localStorage.getItem("nroderemito"));
  const [grabar, setGrabar] = useState(true);

  const [inputFields, setInputFields] = useState([
    {
      nroderemito: localStorage.getItem("nroderemito"),
      codprov: localStorage.getItem("codprov"),
      fecha: localStorage.getItem("fecha"),
      codprod: "",
      cantidad: 0,
      // monto: 0,
    },
  ]);

  const handleAddFields = () => {
    const values = [...inputFields];
    console.log(
      inputFields.nroderemito,
      inputFields.codprov,
      inputFields.fecha
    );
    values.push({
      nroderemito: localStorage.getItem("nroderemito"),
      codprov: localStorage.getItem("codprov"),
      fecha: localStorage.getItem("fecha"),
      codprod: "",
      cantidad: 0,
      // monto: 0,
    });
    setInputFields(values);
  };
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };
  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "nroderemito") {
      values[index].nroderemito = event.target.value;
    }

    if (event.target.name === "codprod") {
      values[index].codprod = event.target.value;
    }

    ///////// ESTO COMENTO PORQUE NO LLEVA PRECIOS
    // const precio1 = listaFilter.filter(function (element) {
    //   return element.codproducto._id === values[index].codprod;
    // });

    if (event.target.name === "cantidad") {
      values[index].cantidad = event.target.value;
    }
    // values[index].monto = precio1[0].preciototalventa;
    setInputFields(values);
  };

  // Cuando GRABO la comanda:

  const handleSubmit = (e) => {
    // for (var i = 0, max = inputFields.length; i < max; i += 1) {
    //   inputFields[i].nroderemito = x + 1;
    // }

    for (var i = 0, max = inputFields.length; i < max; i += 1) {
      addRemito(inputFields[i])
        .then(() => {
          // setInputFields({
          //   ...inputFields[i],
          //   [e.target.name]: e.target.value,
          // });
          // console.log(resp);

          //throw new Error("Algo falló");
          setGrabar(true);
        })
        .catch(() => setGrabar(false));
    }

    return (
      <>
        {grabar
          ? alert("Remito guardado....")
          : alert("No puedo realizarse la grabacion... Intente nuevamente...")}
      </>
    );

    // localStorage.setItem("nroderemito", x + 1);
  };

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

  return (
    <>
      <div className="container">
        <h5 className="prueba mt-3">
          PRODUCTOS/SERVICIOS---------------------------------CANTIDAD
        </h5>
        <h4 className="prueba1 mt-3">
          PRODUCTOS/SERVICIOS-------------CANTIDAD
        </h4>
        {!producservs.loading && (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-row col-md-6">
                {inputFields.map((inputField, index) => (
                  <Fragment key={`${inputField}${index}`}>
                    <div className="form-group">
                      <select
                        className="form-control col-md-12"
                        id="codprod"
                        name="codprod"
                        value={inputField.codprod}
                        onChange={(event) => handleInputChange(index, event)}
                        required
                      >
                        <option selected value="">
                          Elija la opción
                        </option>
                        {producservs.data.producservs.map((producserv) => (
                          <option value={producserv._id}>
                            {producserv.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="cantidad"
                        name="cantidad"
                        maxLength="10"
                        value={inputField.cantidad}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        className="btn btn-danger mt-2"
                        id="masmenos"
                        type="button"
                        onClick={() => handleRemoveFields(index)}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-success mt-2"
                        id="masmenos"
                        type="button"
                        onClick={() => handleAddFields()}
                      >
                        +
                      </button>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="submit-button">
              <button
                className="btn btn-dark mt-5 mb-3"
                id="button"
                type="submit"
                onSubmit={handleSubmit}
              >
                Guardar Remito
              </button>
            </div>
          </form>
        )}
        {/* <h4>Generar PDF</h4> */}
      </div>
    </>
  );
};
export default AddRemitoFormDynamics;
