import axios from "axios";
import qs from "qs";
export const postLogin = async (datos) => {
  const url = `http://backavicolanicola.us-3.evennode.com/login`;
  // const url = `http://localhost:3004/login`;
  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: qs.stringify(datos),
  };
  try {
    const resp = await axios(url, options);
    const { data } = resp;
    return {
      data: data,
      loading: false,
    };
  } catch (error) {
    return {
      data: error.response.data,
      loading: false,
    };
  }
};

//Traer todos los cursos con el limite y desde que registro
export const getUsuarios = async () => {
  const token = JSON.parse(localStorage.getItem("token")) || "";

  let url = `http://backavicolanicola.us-3.evennode.com/usuarios`;
  // let url = `http://localhost:3004/usuarios`;
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token: token,
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
//Traer un curso según su id
export const getUsuarioId = async (id) => {
  let url = `http://backavicolanicola.us-3.evennode.com/${id}`;
  // let url = `http://localhost:3004/usuarios/${id}`;
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
