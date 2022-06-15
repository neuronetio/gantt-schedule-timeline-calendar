export function fixed(nr: string | number) {
  return parseFloat(parseFloat(nr.toString()).toFixed(2));
}

export const examples = [
  '/examples/complex-1',
  '/examples/item-types-plugin',
  '/examples/add-rows-items',
  '/examples/item-slot-html-content',
];
