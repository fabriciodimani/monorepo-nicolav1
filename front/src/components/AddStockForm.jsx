import React, { useState, useEffect } from "react";
import { addStock } from "../helpers/rutaStocks";
import { getProducservs } from "../helpers/rutaProducservs";
import { getProducservId } from "../helpers/rutaProducservs";
import { getTipomovimientoId } from "../helpers/rutaTipomovimientos";
import { getTipomovimientos } from "../helpers/rutaTipomovimientos";
import { modifProducserv } from "../helpers/rutaProducservs";
import "../css/addstockform.css";

const AddStockForm = ({ setShow }) => {
  const id = localStorage.getItem("id");
  console.log(id);
  const [formValues, setFormValues] = useState({
    codprod: "",
    movimiento: "",
    cantidad: "",
    stkactual: "",
    fecha: "",
    usuario: id
  });
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const [tipomovimientos, setTipomovimientos] = useState({
    data: {},
    loading: true,
  });

  useEffect(() => {
    getTipomovimientos().then((tipomovimientos) => {
      setTipomovimientos({
        data: tipomovimientos,
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

  var resmov;
  // formValues.movimiento

  const handleSubmit = (e) => {
    document.getElementById('button').disabled = true
    e.preventDefault();

    // Este modifica el campo stkactual
    // console.log(formValues.codprod);
    // aca suma cantidada + stock actual producservs
    // console.log(formValues.movimiento);
    getTipomovimientoId(formValues.movimiento).then((mov) => {
      resmov = parseInt(mov.tipomovimientos.factor);
      // console.log(mov);
      // console.log(resmov);

      getProducservId(formValues.codprod).then((stk) => {
        // console.log("STK PRODUCSERV:", stk.producservs.stkactual);
        // console.log("CANTIDAD:", formValues.cantidad);

        // Para sacar el factor

        // console.log("RESMOV:", resmov);

        let resstk =
          parseInt(stk.producservs.stkactual) +
          parseInt(formValues.cantidad) * parseInt(resmov);
        console.log("RESSTK:", resstk);
        modifProducserv(
          { stkactual: parseInt(resstk) },
          formValues.codprod
        ).then((respuesta) => {
          console.log(respuesta);
          // alert(respuesta);
        });
      });

      addStock(formValues).then((resp) => {
        // console.log(resp);
        setFormValues({
          codprod: "",
          movimiento: "",
          cantidad: "",
          fecha: "",
          usuario: id,
        });
        document.getElementById('button').disabled = false;
        //   setShow(false);
      });
    });
  };

  return (
    <>
      {!producservs.loading && !tipomovimientos.loading && (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group mt-3 col-sm-3">
                <label className="">Producto/Servicio</label>
                <select
                  className="form-control"
                  name="codprod"
                  value={formValues.codprod}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {producservs.data.producservs.map((producserv) => (
                    <option value={producserv._id}>
                      {producserv.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mt-3 col-sm-3">
                <label className="">Movimiento</label>
                <select
                  className="form-control"
                  name="movimiento"
                  value={formValues.movimiento}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija opción
                  </option>
                  {tipomovimientos.data.tipomovimientos.map(
                    (tipomovimiento) => (
                      <option value={tipomovimiento._id}>
                        {tipomovimiento.movimiento}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group mt-3 col-sm-1">
                <label className="">Cantidad</label>
                <input
                  type="text"
                  className="form-control"
                  name="cantidad"
                  maxLength="5"
                  required
                  value={formValues.cantidad}
                  onChange={handleChange}
                />
                {/* {console.log(formValues.cantidad)} */}
              </div>

              <div className="form-group mt-3 col-sm-3">
                <label className="">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha"
                  maxLength="20"
                  required
                  // default={Date.now()}
                  value={formValues.fecha}
                  onChange={handleChange}
                />
                {/* {console.log(formValues.fecha)} */}
              </div>
            </div>

            <div>
              <button
                // onClick="document.getElementById('button').disabled = true"
                // onClick={(e) => {document.getElementById('button').disabled = true}}
                type="submit"
                className="btn btn-dark mt-5 mb-3"
                id="button"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

    </>
  );
};

export default AddStockForm;

// getProducservId(formValues.codprod).then((stk) => {
    //   console.log("STK PRODUCSERV:", stk.producservs.stkactual);
    //   console.log("CANTIDAD:", formValues.cantidad);

    //   // Para sacar el factor

    //   console.log("RESMOV:", resmov);

    //   let resstk =
    //     parseInt(stk.producservs.stkactual) +
    //     parseInt(formValues.cantidad) * parseInt(resmov);
    //   console.log("RESSTK:", resstk);
    //   modifProducserv({ stkactual: parseInt(resstk) }, formValues.codprod).then(
    //     (respuesta) => {
    //       console.log(respuesta);
    //       // alert(respuesta);
    //     }
    //   );
    // });

    // //if (!producservs.loading) {
    // addStock(formValues).then((resp) => {
    //   console.log(resp);
    //   setFormValues({
    //     codprod: "",
    //     movimiento: "",
    //     cantidad: "",
    //     fecha: "",
    //   });
    //   //   setShow(false);
    // });
    // }
