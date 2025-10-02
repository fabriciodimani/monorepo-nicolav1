import axios from "axios";
import qs from "qs";
//Traer todos los cursos con el limite y desde que registro
export const getRemitos = async () => {
  let url = `http://localhost:3004/remitos`;
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
//Traer un curso según su id
export const getRemitoId = async (id) => {
  let url = `http://localhost:3004/remitos/${id}`;
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
// export const getCarousel = async () => {
//   const resp = await axios("https://damp-falls-98546.herokuapp.com/");
//   const { data } = resp;
//   return data;
// };
// export const getMarquesina = async () => {
//   const resp = await axios("https://damp-falls-98546.herokuapp.com/");
//   const { data } = resp;
//   return data;
// };
// Crear nuevo empresa
export const addRemito = async (datos) => {
  // e.preventDefault();
  const token = JSON.parse(localStorage.getItem("token")) || "";
  let url = "http://localhost:3004/remitos";
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
export const modifRemito = async (datos, id) => {
  // console.log(datos);
  const token = JSON.parse(localStorage.getItem("token")) || "";
  let url = `http://localhost:3004/remitos/${id}`;
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
export const delRemito = async (id) => {
  const token = JSON.parse(localStorage.getItem("token")) || "";
  let url = `http://localhost:3004/remitos/${id}`;
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
    return data;
  } catch (error) {
    console.log(error.response.data);
    return {
      data: error.response.data,
      loading: false,
    };
  }
};
