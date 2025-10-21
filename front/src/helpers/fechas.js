const TIME_ZONE = "America/Argentina/Buenos_Aires";

const formateadorFecha = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const formatearFechaArgentinaParaInput = (valor) => {
  if (!valor) {
    return "";
  }

  const fecha = valor instanceof Date ? valor : new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "";
  }

  return formateadorFecha.format(fecha);
};

export const obtenerFechaArgentinaHoy = () => formateadorFecha.format(new Date());

export default obtenerFechaArgentinaHoy;
