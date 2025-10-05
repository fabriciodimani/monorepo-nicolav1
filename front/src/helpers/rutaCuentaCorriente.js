import axios from "axios";
import qs from "qs";

const BASE_URL = "http://localhost:3004";

const buildHeaders = () => {
  const token = JSON.parse(localStorage.getItem("token")) || "";
  return {
    "content-type": "application/x-www-form-urlencoded",
    token,
  };
};

export const getMovimientosCuentaCorriente = async (clienteId) => {
  const url = `${BASE_URL}/cuentacorriente/${clienteId}`;
  const options = {
    method: "GET",
    headers: buildHeaders(),
  };

  try {
    const resp = await axios(url, options);
    return resp.data;
  } catch (error) {
    return (
      error.response?.data || {
        ok: false,
        err: { message: "Error de conexión al consultar la cuenta corriente" },
      }
    );
  }
};

export const registrarPagoCuentaCorriente = async (datos) => {
  const url = `${BASE_URL}/cuentacorriente/pago`;
  const options = {
    method: "POST",
    headers: buildHeaders(),
    data: qs.stringify(datos),
  };

  try {
    const resp = await axios(url, options);
    return resp.data;
  } catch (error) {
    return (
      error.response?.data || {
        ok: false,
        err: { message: "Error de conexión al registrar el pago" },
      }
    );
  }
};
