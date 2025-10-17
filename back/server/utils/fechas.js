const TIME_ZONE = "America/Argentina/Buenos_Aires";
const DEFAULT_OFFSET_MINUTES = -3 * 60;

const obtenerOffsetEnMinutos = (date) => {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      timeZoneName: "short",
    });

    const parts = formatter.formatToParts(date);
    const zona = parts.find((part) => part.type === "timeZoneName");

    if (zona && typeof zona.value === "string") {
      const match = zona.value.match(/GMT([+-]?\d{1,2})(?::(\d{2}))?/i);

      if (match) {
        const horas = parseInt(match[1], 10);
        const minutos = match[2] ? parseInt(match[2], 10) : 0;
        if (!Number.isNaN(horas) && !Number.isNaN(minutos)) {
          const signo = horas < 0 ? -1 : 1;
          return signo * (Math.abs(horas) * 60 + Math.abs(minutos));
        }
      }
    }
  } catch (error) {
    // Ignoramos el error y utilizamos el desplazamiento por defecto.
  }

  return DEFAULT_OFFSET_MINUTES;
};

const obtenerComponentesArgentina = (date) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  return parts.reduce((acumulado, part) => {
    if (part.type !== "literal") {
      acumulado[part.type] = part.value;
    }
    return acumulado;
  }, {});
};

const obtenerFechaArgentina = (valor) => {
  const base =
    valor instanceof Date
      ? new Date(valor.getTime())
      : valor
      ? new Date(valor)
      : new Date();

  if (Number.isNaN(base.getTime())) {
    return null;
  }

  const componentes = obtenerComponentesArgentina(base);
  const year = Number(componentes.year);
  const month = Number(componentes.month);
  const day = Number(componentes.day);
  const hour = Number(componentes.hour);
  const minute = Number(componentes.minute);
  const second = Number(componentes.second);

  if ([year, month, day, hour, minute, second].some(Number.isNaN)) {
    return null;
  }

  const offsetMinutos = obtenerOffsetEnMinutos(base);
  const utcMillis =
    Date.UTC(year, month - 1, day, hour, minute, second) -
    offsetMinutos * 60 * 1000;

  return new Date(utcMillis);
};

module.exports = {
  obtenerFechaArgentina,
};
