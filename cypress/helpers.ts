export function fixed(nr: string | number) {
  return parseFloat(parseFloat(nr.toString()).toFixed(2));
}
export function round(nr: string | number) {
  return Math.round(parseFloat(nr.toString()));
}
export const examples = [
  '/examples/complex-1',
  '/examples/item-types-plugin',
  '/examples/add-rows-items',
  '/examples/item-slot-html-content',
];
