import React, { useState, useEffect, useContext, useMemo } from "react";
import Select from "react-select";
import { getClientesPorNombre } from "../helpers/rutaClientes";
import { getUsuarios } from "../helpers/rutaUsuarios";
import { getListas } from "../helpers/rutaListas";
import ActualizaComanda from "../components/ActualizaComanda";
import AddFormDynamics from "../components/AddFormDynamics";
import "../css/addcomandaform.css";
import ThemeContext from "../Context/ThemeContext";

const AddComandaForm = () => {
  const { theme } = useContext(ThemeContext);
  const [guardar, setGuardar] = useState(false);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [codcli, setCodcli] = useState("");
  const [razonsocial, setRazonsocial] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [lista, setLista] = useState("");
  const [loadingBusquedaClientes, setLoadingBusquedaClientes] = useState(false);
  const [errorBusquedaClientes, setErrorBusquedaClientes] = useState("");
  const [listas, setListas] = useState({ data: {}, loading: true });
  const [usuarios, setUsuarios] = useState({ data: {}, loading: true });

  useEffect(() => {
    getListas().then((res) => setListas({ data: res, loading: false }));
    getUsuarios().then((res) => setUsuarios({ data: res, loading: false }));
  }, []);

  useEffect(() => {
    const termino = inputValue.trim();

    if (termino.length < 3) {
      setClientesFiltrados(
        selectedCliente
          ? [
              {
                _id: selectedCliente.value,
                razonsocial: selectedCliente.label,
              },
            ]
          : []
      );
      setLoadingBusquedaClientes(false);
      setErrorBusquedaClientes("");
      return;
    }

    let cancelado = false;
    setLoadingBusquedaClientes(true);
    setErrorBusquedaClientes("");

    const timeoutId = setTimeout(async () => {
      try {
        const respuesta = await getClientesPorNombre(termino);

        if (cancelado) {
          return;
        }

        if (respuesta?.ok) {
          let nuevosClientes = Array.isArray(respuesta.clientes)
            ? respuesta.clientes.slice(0, 30)
            : [];

          if (
            selectedCliente &&
            !nuevosClientes.some((cliente) => cliente._id === selectedCliente.value)
          ) {
            nuevosClientes = [
              {
                _id: selectedCliente.value,
                razonsocial: selectedCliente.label,
              },
              ...nuevosClientes,
            ];
          }

          setClientesFiltrados(nuevosClientes);
          setErrorBusquedaClientes("");
        } else {
          const mensajeError =
            respuesta?.err?.message ||
            respuesta?.error ||
            "No fue posible buscar clientes";
          setErrorBusquedaClientes(mensajeError);
          setClientesFiltrados(
            selectedCliente
              ? [
                  {
                    _id: selectedCliente.value,
                    razonsocial: selectedCliente.label,
                  },
                ]
              : []
          );
        }
      } catch (err) {
        if (!cancelado) {
          setErrorBusquedaClientes("No fue posible buscar clientes");
          setClientesFiltrados(
            selectedCliente
              ? [
                  {
                    _id: selectedCliente.value,
                    razonsocial: selectedCliente.label,
                  },
                ]
              : []
          );
        }
      } finally {
        if (!cancelado) {
          setLoadingBusquedaClientes(false);
        }
      }
    }, 300);

    return () => {
      cancelado = true;
      clearTimeout(timeoutId);
    };
  }, [inputValue, selectedCliente]);

  const selectStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        backgroundColor: theme === "dark" ? "#22344d" : "#fff",
        color: theme === "dark" ? "#f1faee" : "#1d3557",
        borderColor:
          theme === "dark"
            ? state.isFocused
              ? "#a8dadc"
              : "rgba(168, 218, 220, 0.6)"
            : base.borderColor,
        boxShadow:
          state.isFocused && theme === "dark"
            ? "0 0 0 1px rgba(168, 218, 220, 0.65)"
            : base.boxShadow,
        "&:hover": {
          ...(base["&:hover"] || {}),
          borderColor:
            theme === "dark"
              ? "#a8dadc"
              : base["&:hover"]?.borderColor || base.borderColor,
        },
      }),
      singleValue: (base) => ({
        ...base,
        color: theme === "dark" ? "#f1faee" : base.color,
      }),
      input: (base) => ({
        ...base,
        color: theme === "dark" ? "#f1faee" : base.color,
      }),
      placeholder: (base) => ({
        ...base,
        color: theme === "dark" ? "rgba(241, 250, 238, 0.75)" : base.color,
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: theme === "dark" ? "#22344d" : base.backgroundColor,
        color: theme === "dark" ? "#f1faee" : base.color,
      }),
      menuList: (base) => ({
        ...base,
        backgroundColor: theme === "dark" ? "#22344d" : base.backgroundColor,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
          ? theme === "dark"
            ? "rgba(168, 218, 220, 0.15)"
            : base.backgroundColor
          : state.isSelected
          ? theme === "dark"
            ? "rgba(168, 218, 220, 0.25)"
            : base.backgroundColor
          : base.backgroundColor,
        color: theme === "dark" ? "#f1faee" : base.color,
      }),
      dropdownIndicator: (base) => ({
        ...base,
        color: theme === "dark" ? "#f1faee" : base.color,
        "&:hover": {
          color: theme === "dark" ? "#a8dadc" : base.color,
        },
      }),
      clearIndicator: (base) => ({
        ...base,
        color: theme === "dark" ? "#f1faee" : base.color,
        "&:hover": {
          color: theme === "dark" ? "#a8dadc" : base.color,
        },
      }),
    }),
    [theme]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (codcli !== "") {
      setGuardar(true);
      setShow(true);
      localStorage.setItem("codcli", codcli);
      localStorage.setItem("lista", lista);
      localStorage.setItem("razonsocial", razonsocial);

      document.getElementById("lista").disabled = true;
      document.getElementById("button").disabled = true;
    } else {
      alert("Error - Seleccione correctamente el Cliente");
    }
  };


  return (
    <>
      {!listas.loading && !usuarios.loading && (
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="form-row">
              <div className="form-group col-sm-6 mb-2">
                <label>Buscar Cliente</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Escriba parte del nombre..."
                  isClearable
                  isSearchable
                  styles={selectStyles}
                  isLoading={loadingBusquedaClientes}
                  loadingMessage={() => "Buscando clientes..."}
                  inputValue={inputValue}
                  value={
                    selectedCliente
                      ? {
                          value: selectedCliente.value,
                          label: selectedCliente.label,
                        }
                      : null
                  }
                  onInputChange={(newValue, { action }) => {
                    if (action === "input-change") {
                      setInputValue(newValue);
                    }
                  }}
                  onChange={(selected) => {
                    if (selected) {
                      const selectedOption = {
                        value: selected.value,
                        label: selected.label,
                      };
                      setSelectedCliente(selectedOption);
                      setCodcli(selected.value);
                      setRazonsocial(selected.label);
                    } else {
                      setSelectedCliente(null);
                      setCodcli("");
                      setRazonsocial("");
                    }
                  }}
                  options={clientesFiltrados.map((cliente) => ({
                    value: cliente._id,
                    label: cliente.razonsocial,
                  }))}
                  noOptionsMessage={() => {
                    if (loadingBusquedaClientes) {
                      return "Buscando clientes...";
                    }

                    if (inputValue.trim().length < 3) {
                      return "Ingrese al menos 3 caracteres";
                    }

                    if (errorBusquedaClientes) {
                      return errorBusquedaClientes;
                    }

                    return "No se encontraron clientes";
                  }}
                />

                {errorBusquedaClientes && (
                  <small className="form-text text-danger d-block mt-1">
                    {errorBusquedaClientes}
                  </small>
                )}

                {!errorBusquedaClientes &&
                  inputValue.trim().length > 0 &&
                  inputValue.trim().length < 3 && (
                    <small className="form-text text-muted d-block mt-1">
                      Ingrese al menos 3 caracteres para buscar
                    </small>
                  )}

                {selectedCliente && (
                  <div className="alert alert-success mt-2 p-2">
                    ✅ Cliente selec.:{" "}
                    <strong>{selectedCliente.label}</strong>
                    {/* Podés mostrar más info si querés:
                    <div>CUIT: {cliente.cuit}</div>
                    <div>Localidad: {cliente.localidad.nombre}</div> */}
                  </div>
                )}
              </div>

              <div className="form-group col-sm-2">
                <label className="">Lista</label>
                <select
                  className="form-control"
                  name="lista"
                  id="lista"
                  required
                  onChange={(e) => setLista(e.target.value)}
                >
                  <option value="">Elija opción</option>
                  {listas.data.listas.map((lista) => (
                    <option key={lista._id} value={lista._id}>
                      {lista.lista}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-dark mt-4 mb-3"
                id="button"
              >
                Guardar Cabecera
              </button>
            </div>
          </div>
        </form>
      )}
      {show ? <AddFormDynamics guardar /> : null}
    </>
  );
};

export default AddComandaForm;
