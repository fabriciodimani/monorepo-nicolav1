const formateadorMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatearMontoARS = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return "";
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "";
  }

  return formateadorMoneda.format(numero);
};

export default formatearMontoARS;
