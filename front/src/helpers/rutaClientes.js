import axios from "axios";
import qs from "qs";
//Traer todos los cursos con el limite y desde que registro
export const getClientes = async () => {
  let url = `http://localhost:3004/clientes`;
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };
  try {
    const resp = await axios(url, options);
    const { data } = resp;
    return data;
  } catch (error) {
    return {
      data: error.response.data,
      loading: false,
    };
  }
};

export const getClientesPorNombre = async (nombre) => {
  let url = `http://localhost:3004/clientes/buscar?nombre=${encodeURIComponent(nombre)}`;
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };
  try {
    const resp = await axios(url, options);
    const { data } = resp;
    return data; // contiene { ok: true, clientes: [...] }
  } catch (error) {
    return {
      data: error.response?.data || { error: "Error de conexión" },
      loading: false,
    };
  }
};


//Traer un curso según su id
export const getClienteId = async (id) => {
  let url = `http://localhost:3004/clientes/${id}`;
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };
  try {
    const resp = await axios(url, options);
    const { data } = resp;
    return data;
  } catch (error) {
    return {
      data: error.response.data,
      loading: false,
    };
  }
};

// Crear nuevo empresa
export const addCliente = async (datos) => {
  // console.log(datos);
  const token = JSON.parse(localStorage.getItem("token")) || "";
  let url = "http://localhost:3004/clientes";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token: token,
    },
    data: qs.stringify(datos),
  };
  try {
    const resp = await axios(url, options);
    const { data } = resp;
    return data;
  } catch (error) {
    // console.log(error.response.data);
    return {
      data: error.response.data,
      loading: false,
    };
  }
};
// Actualizar Propiedad
export const modifCliente = async (datos, id) => {
  // console.log(datos);
  const token = JSON.parse(localStorage.getItem("token")) || "";
  let url = `http://localhost:3004/clientes/${id}`;
  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token: token,
    },
    data: qs.stringify(datos),
  };
  try {
    const resp = await axios(url, options);
    const { data } = resp;
    return data;
  } catch (error) {
    console.log(error.response.data);
    return {
      data: error.response.data,
      loading: false,
    };
  }
};
// Inactivar un propiedad
export const delCliente = async (id) => {
  const token = JSON.parse(localStorage.getItem("token")) || "";
  let url = `http://localhost:3004/clientes/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token: token,
    },
  };
  try {
    const resp = await axios(url, options);
    const { data } = resp;
    // console.log(data);
    return data;
  } catch (error) {
    // console.log(error.response.data);
    return {
      data: error.response.data,
      loading: false,
    };
  }
};
