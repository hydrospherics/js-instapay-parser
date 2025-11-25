import { p as pG } from './parser.js';
import * as Tags from './constants.js';

export { Tags };

export function p(str, o) {
  return pG(str, o);
}

export class IP {
  constructor(str, o = {}) {
    this.d = pG(str, o);
  }

  get raw() {
    return this.d;
  }

  get amt() {
    return this.d[Tags.ID_TRANSACTION_AMOUNT] || null;
  }

  get cur() {
    return this.d[Tags.ID_TRANSACTION_CURRENCY];
  }

  get mN() {
    return this.d[Tags.ID_MERCHANT_NAME];
  }

  get mC() {
    return this.d[Tags.ID_MERCHANT_CITY];
  }

  get cC() {
    return this.d[Tags.ID_COUNTRY_CODE];
  }

  get aI() {
    for (let i = 26; i <= 51; i++) {
      const id = i.toString().padStart(2, '0');
      if (this.d[id]) {
        return this.d[id];
      }
    }
    return null;
  }
}
