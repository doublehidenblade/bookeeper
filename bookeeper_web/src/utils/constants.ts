import { arrSum } from './helpers'

export const WITHHOLDING_RATE = 0.25;
export const INCOME_TAX_RATE = 0.3;
export const BILLS = 5000;
export const ANNUAL_EXPENSES = 2000;
export const PRICE = 200;
export const OTHER_INCOME = 0;
export const PARTS_NEEDED = ['glass', 'plastic'];
export const PARTS_PER_UNIT = {
  glass: 3,
  plastic: 2
};
export const PRICE_PER_PART = {
  glass: 50,
  plastic: 10
}
export const COST_PER_UNIT = arrSum(PARTS_NEEDED.map(part => {
  return PARTS_PER_UNIT[part] * PRICE_PER_PART[part];
}))

