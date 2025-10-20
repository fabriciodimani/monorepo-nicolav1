import axios from "axios";
import qs from "qs";

const BASE_URL = "http://localhost:3004/facturascompra";

export const getFacturasCompra = async () => {
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const resp = await axios(BASE_URL, options);
    return resp.data;
  } catch (error) {
    return {
      data: error.response?.data,
      loading: false,
    };
  }
};

export const addFacturaCompra = async (datos) => {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(datos),
  };

  try {
    const resp = await axios(BASE_URL, options);
    return resp.data;
  } catch (error) {
    return {
      ok: false,
      err: error.response?.data || error,
    };
  }
};

export const getFacturaCompraId = async (id) => {
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const resp = await axios(`${BASE_URL}/${id}`, options);
    return resp.data;
  } catch (error) {
    return {
      ok: false,
      err: error.response?.data || error,
    };
  }
};

export const updateFacturaCompra = async (datos, id) => {
  const token = JSON.parse(localStorage.getItem("token")) || "";

  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token,
    },
    data: qs.stringify(datos),
  };

  try {
    const resp = await axios(`${BASE_URL}/${id}`, options);
    return resp.data;
  } catch (error) {
    return {
      ok: false,
      err: error.response?.data || error,
    };
  }
};

export const deleteFacturaCompra = async (id) => {
  const token = JSON.parse(localStorage.getItem("token")) || "";

  const options = {
    method: "DELETE",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token,
    },
  };

  try {
    const resp = await axios(`${BASE_URL}/${id}`, options);
    return resp.data;
  } catch (error) {
    return {
      ok: false,
      err: error.response?.data || error,
    };
  }
};
