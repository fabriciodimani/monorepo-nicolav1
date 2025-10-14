export const calcularSaldoMovimiento = (movimiento = {}) => {
  const monto = Number(movimiento.monto);
  const cantidad = Number(movimiento.cantidad);

  const montoValido = Number.isFinite(monto) ? monto : 0;
  const cantidadValida = Number.isFinite(cantidad) ? cantidad : null;

  if (cantidadValida && cantidadValida !== 0) {
    return cantidadValida * montoValido;
  }

  return montoValido;
};

export const calcularSaldoTotal = (movimientos = []) =>
  movimientos.reduce(
    (total, movimiento) => total + calcularSaldoMovimiento(movimiento),
    0
  );
