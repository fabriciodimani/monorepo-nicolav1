import axios from "axios";
import qs from "qs";

const API_URL = "http://backavicolanicola.us-3.evennode.com";

const getToken = () => JSON.parse(localStorage.getItem("token")) || "";

export const getMovimientosCuentaCorrienteProveedores = async (proveedorId) => {
  if (!proveedorId) {
    return {
      ok: false,
      err: { message: "Debe seleccionar un proveedor" },
    };
  }

  const token = getToken();
  const url = `${API_URL}/cuentacorrienteproveedores/${proveedorId}`;

  const options = {
    method: "GET",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token,
    },
  };

  try {
    const { data } = await axios(url, options);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        ok: false,
        err: { message: "Error al consultar la cuenta corriente" },
      }
    );
  }
};

export const registrarPagoCuentaCorrienteProveedor = async (datos) => {
  const token = getToken();
  const url = `${API_URL}/cuentacorrienteproveedores/pago`;

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      token,
    },
    data: qs.stringify(datos),
  };

  try {
    const { data } = await axios(url, options);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        ok: false,
        err: { message: "Error al registrar el pago" },
      }
    );
  }
};
