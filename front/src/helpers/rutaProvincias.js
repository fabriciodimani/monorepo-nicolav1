import axios from "axios";
import qs from "qs";
//Traer todos los cursos con el limite y desde que registro
export const getProvincias = async () => {
  let url = `http://localhost:3004/provincias`;
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
export const getProvinciasId = async (id) => {
  let url = `http://localhost:3004/provincias/${id}`;
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
