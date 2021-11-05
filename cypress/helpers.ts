export function fixed(nr: string | number) {
  return parseFloat(parseFloat(nr.toString()).toPrecision(2));
}
