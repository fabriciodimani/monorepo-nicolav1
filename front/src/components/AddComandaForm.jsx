import React, { useState, useEffect, useContext, useMemo } from "react";
import Select from "react-select";
import { debounce } from "lodash";
import { getClientesPorNombre, getClientes } from "../helpers/rutaClientes";
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
  const [clientes, setClientes] = useState({ data: {}, loading: true });
  const [listas, setListas] = useState({ data: {}, loading: true });
  const [usuarios, setUsuarios] = useState({ data: {}, loading: true });

  // 🧠 Inicial: todos los clientes
  useEffect(() => {
    getClientes().then((res) => {
      setClientes({ data: res, loading: false });
      setClientesFiltrados(res.clientes);
    });
    getListas().then((res) => setListas({ data: res, loading: false }));
    getUsuarios().then((res) => setUsuarios({ data: res, loading: false }));
  }, []);

  // 🔎 Búsqueda parcial
  const buscarClientesDebounced = debounce((texto) => {
    if (texto.length >= 3) {
      setClientes((prev) => ({ ...prev, loading: true }));
      getClientesPorNombre(texto).then((res) => {
        let nuevosClientes = res.clientes;

        // Mantener selección si no viene en el resultado
        if (
          selectedCliente &&
          !nuevosClientes.find((c) => c._id === selectedCliente.value)
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
        setClientes((prev) => ({ ...prev, loading: false }));
      });
    }
  }, 400);

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
      {!clientes.loading && !listas.loading && !usuarios.loading && (
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
                      buscarClientesDebounced(newValue);
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
                />

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
