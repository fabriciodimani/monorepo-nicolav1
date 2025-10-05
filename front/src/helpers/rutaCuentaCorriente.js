import axios from "axios";
import qs from "qs";

const BASE_URL = "http://localhost:3004";

const buildAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem("token")) || "";

  return {
    "content-type": "application/x-www-form-urlencoded",
    token,
  };
};

export const getMovimientosCuentaCorriente = async (clienteId) => {
  if (!clienteId) {
    return { ok: false, err: { message: "Cliente no indicado" } };
  }

  const url = `${BASE_URL}/cuentacorriente/${clienteId}`;

  const options = {
    method: "GET",
    headers: buildAuthHeaders(),
  };

  try {
    const resp = await axios(url, options);
    return resp.data;
  } catch (error) {
    return {
      ok: false,
      err: error.response?.data?.err || {
        message: "No se pudo obtener la cuenta corriente",
      },
    };
  }
};

export const registrarPagoCuentaCorriente = async (datos) => {
  const url = `${BASE_URL}/cuentacorriente/pago`;

  const options = {
    method: "POST",
    headers: buildAuthHeaders(),
    data: qs.stringify(datos),
  };

  try {
    const resp = await axios(url, options);
    return resp.data;
  } catch (error) {
    return {
      ok: false,
      err: error.response?.data?.err || {
        message: "No se pudo registrar el pago",
      },
    };
  }
};
