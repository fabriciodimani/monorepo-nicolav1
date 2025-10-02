import React, { useState, useEffect } from "react";
import { getPrecios } from "../helpers/rutaPrecios";
import { addPrecio } from "../helpers/rutaPrecios";
import { getProducservs } from "../helpers/rutaProducservs";
import { getListas } from "../helpers/rutaListas";
import "../css/addprecioform.css";

const AddPrecioForm = ({ setShow }) => {
  //const id = JSON.parse(localStorage.getItem("id"));

  const [grabo, setGrabo] = useState(false);

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

  const [precios, setPrecios] = useState({
    data: {},
    loading: true,
  });
  useEffect(() => {
    getPrecios().then((precios) => {
      setPrecios({
        data: precios,
        loading: false,
      });
    });
  }, []);

  const [formValues, setFormValues] = useState({
    codproducto: "",
    lista: "",
    precionetocompra: "",
    ivacompra: "",
    preciototalcompra: "",
    precionetoventa: "",
    ivaventa: "",
    preciototalventa: "",
    // usuario: id,
  });
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // if (!producservs.loading || (!listas.loading))  {

    // }

    console.log("Precios:", precios.data.precios);
    console.log("LISTAS:", listas.data.listas);
    console.log("CODPROD:", formValues.codproducto);
    console.log("LISTA:", formValues.lista);

    // debugger

    // for (let i = 0; i < producservs.data.producservs.length; i++) {
    const foundProduct = precios.data.precios.find(
      (producto) =>
        producto.codproducto._id === formValues.codproducto &&
        producto.lista._id === formValues.lista
    );
    // const foundLista = foundProduct.find(
    //   (lista) => lista.lista._id === formValues.lista
    // );

    console.log(foundProduct);
    // console.log(foundLista);

    // debugger;

    if (foundProduct === undefined) {
      addPrecio(formValues).then((resp) => {
        console.log(resp);
        setFormValues({
          codproducto: "",
          lista: "",
          precionetocompra: "",
          ivacompra: "",
          preciototalcompra: "",
          precionetoventa: "",
          ivaventa: "",
          preciototalventa: "",
        });
      });

      alert("Lista de Precio agregada con exito");
    } else {
      alert(
        "No se puede GUARDAR. Productos y Lista Repetidos:" +
          " " +
          foundProduct.codproducto.descripcion +
          " con " +
          foundProduct.lista.lista
      );
    }

    // if (foundLista !== undefined && foundProduct === undefined) {
    //   addPrecio(formValues).then((resp) => {
    //     console.log(resp);
    //     setFormValues({
    //       codproducto: "",
    //       lista: "",
    //       precionetocompra: "",
    //       ivacompra: "",
    //       preciototalcompra: "",
    //       precionetoventa: "",
    //       ivaventa: "",
    //       preciototalventa: "",
    //     });
    //   });
    // }

    // } else if (foundLista !== undefined) {
    //   addPrecio(formValues).then((resp) => {
    //     console.log(resp);
    //     setFormValues({
    //       codproducto: "",
    //       lista: "",
    //       precionetocompra: "",
    //       ivacompra: "",
    //       preciototalcompra: "",
    //       precionetoventa: "",
    //       ivaventa: "",
    //       preciototalventa: "",
    //     });
    //   });
    // } else {
    //   alert("No se puede GUARDAR. Productos y Lista Repetidos");
    // }

    // }

    //debugger;

    // const foundLista = listas.data.listas[0].find(
    //   (lista) => lista === formValues.lista
    // );

    // console.log("foundProducto:", foundProduct)
    // console.log("foundListas:", foundLista)

    // if (foundProduct !== undefined && foundLista !== undefined) {
    // console.log(producservs.data.producservs[0].includes(formValues.codproducto))
    // debugger

    //acaaaaaaaaa cambbbbbiiiaaaarrr map o for

    // for (let i = 0; i < producservs.data.producservs.length; ) {
    //   // console.log(producservs.data.producservs[i]);
    //   // console.log("formvalues prod", formValues.codproducto);
    //   if (producservs.data.producservs[i]._id !== formValues.codproducto) {
    //     i++;
    //   } else {
    //     i = producservs.data.producservs.length;
    //     addPrecio(formValues).then((resp) => {
    //       console.log(resp);
    //       setFormValues({
    //         codproducto: "",
    //         lista: "",
    //         precionetocompra: "",
    //         ivacompra: "",
    //         preciototalcompra: "",
    //         precionetoventa: "",
    //         ivaventa: "",
    //         preciototalventa: "",
    //       });
    //     });
    //     // alert("No se puede GUARDAR. Productos y Lista Repetidos");
    //   }
    // }
  };

  return (
    <>
      {!producservs.loading && !listas.loading && (
        <div className="container">
          {/* {localidades.data.localidades.map((localidad) => (
            <h3>{localidad.localidad}</h3>
          ))} */}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-sm-4">
                <label className="mt-3">Producto/Servicio</label>
                <select
                  className="form-control"
                  name="codproducto"
                  value={formValues.codproducto}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {producservs.data.producservs.map((producserv) => (
                    <option value={producserv._id}>
                      {producserv.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-sm-3">
                <label className="mt-3">Lista</label>
                <select
                  className="form-control"
                  name="lista"
                  value={formValues.lista}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija la opción adecuada
                  </option>
                  {listas.data.listas.map((lista) => (
                    <option value={lista._id}>{lista.lista}</option>
                  ))}
                </select>
              </div>
            </div>

            <h4 className="compraventa mt-5">PRECIO COMPRA</h4>
            
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="form-group ">Precio Neto</label>
                  <input
                    type="text"
                    className="form-control"
                    name="precionetocompra"
                    maxLength="20"
                    required
                    value={formValues.precionetocompra}
                    onChange={handleChange}
                  />
                  {console.log(formValues.precionetocompra)}
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label className="form-group">Iva</label>
                  <select
                    className="form-control"
                    name="ivacompra"
                    value={formValues.ivacompra}
                    onChange={handleChange}
                    required
                  >
                    <option selected value="">
                      Elija la opción
                    </option>
                    <option>10.5</option>,<option>21</option>
                  </select>
                </div>
              </div>

              <div className="col">
              <div className="form-group">
                <label className="form-group">Precio Total</label>
                <input
                  type="text"
                  className="form-control"
                  name="preciototalcompra"
                  maxLength="20"
                  required
                  value={formValues.preciototalcompra}
                  onChange={handleChange}
                />
                {console.log(formValues.preciototalcompra)}
              </div>
              </div>
            </div>
            

            <h4 className="compraventa mt-5">PRECIO VENTA</h4>
            
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="form-group ">Precio Neto</label>
                  <input
                    type="text"
                    className="form-control"
                    name="precionetoventa"
                    maxLength="20"
                    required
                    value={formValues.precionetoventa}
                    onChange={handleChange}
                  />
                  {console.log(formValues.precionetoventa)}
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label className="form-group">Iva</label>
                  <select
                    className="form-control"
                    name="ivaventa"
                    value={formValues.ivaventa}
                    onChange={handleChange}
                    required
                  >
                    <option selected value="">
                      Elija la opción
                    </option>
                    <option>10.5</option>,<option>21</option>
                  </select>
                </div>
              </div>

              <div className="col">
              <div className="form-group">
                <label className="form-group">Precio Total</label>
                <input
                  type="text"
                  className="form-control"
                  name="preciototalventa"
                  maxLength="20"
                  required
                  value={formValues.preciototalventa}
                  onChange={handleChange}
                />
                {console.log(formValues.preciototalventa)}
              </div>
              </div>
            </div>
            
            {/* <h4 className="compraventa mt-5">PRECIO VENTA</h4>
            <div className="form-row" id="venta">
              <div className="form-group col-sm-2">
                <label className="">Precio Neto</label>
                <input
                  type="text"
                  className="form-control"
                  name="precionetoventa"
                  maxLength="20"
                  required
                  value={formValues.precionetoventa}
                  onChange={handleChange}
                />
                {console.log(formValues.precionetoventa)}
              </div>

              <div className="form-group col-sm-2">
                <label className="">Iva</label>
                <select
                  className="form-control"
                  name="ivaventa"
                  value={formValues.ivaventa}
                  onChange={handleChange}
                  required
                >
                  <option selected value="">
                    Elija la opción
                  </option>
                  <option>10.5</option>,<option>21</option>
                </select>
              </div>

              <div className="form-group col-sm-2">
                <label className="">Precio Total</label>
                <input
                  type="text"
                  className="form-control"
                  name="preciototalventa"
                  maxLength="20"
                  required
                  value={formValues.preciototalventa}
                  onChange={handleChange}
                />
                {console.log(formValues.preciototalventa)}
              </div>
            </div> */}
            <div>
              <button
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

export default AddPrecioForm;
