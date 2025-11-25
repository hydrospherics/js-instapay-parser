import { vCRC } from './crc.js';
import * as Tags from './constants.js';

export function p(str, o = {}) {
  if (!vCRC(str)) {
    throw new Error('invalid CRC');
  }

  const r = pTLV(str.slice(0, -4));
  r[Tags.ID_CRC] = str.slice(-4);
  const s = o.strict !== false;
  if (s) {
    if (r[Tags.ID_COUNTRY_CODE] !== 'PH') {
      throw new Error('country code: expected PH');
    }
    if (r[Tags.ID_TRANSACTION_CURRENCY] !== '608') {
      throw new Error('currency code: expected 608');
    }
    
    const mN = r[Tags.ID_MERCHANT_NAME];
    if (mN && mN.length > 25) {
      throw new Error('merchant name: length must be <= 25');
    }

    const mC = r[Tags.ID_MERCHANT_CITY];
    if (mC && mC.length > 15) {
      throw new Error('merchant city: length must be <= 15');
    }
  }

  return r;
}

function pTLV(str) {
  const r = {};
  let i = 0;

  while (i < str.length) {
    const id = str.slice(i, i + 2);
    if (!/^\d{2}$/.test(id)) {
      throw new Error(`invalid tag ID: ${id}`);
    }

    const lS = str.slice(i + 2, i + 4);
    
    if (lS.length < 2) break;
    
    const l = parseInt(lS, 10);
    const v = str.slice(i + 4, i + 4 + l);

    if (v.length < l) break;

    if (sR(id)) {
      r[id] = pTLV(v);
    } else {
      r[id] = v;
    }

    i += 4 + l;
  }

  return r;
}

function sR(id) {
  return (
    (id >= Tags.ID_MERCHANT_ACCOUNT_INFORMATION_RANGE_START && id <= Tags.ID_MERCHANT_ACCOUNT_INFORMATION_RANGE_END) ||
    id === Tags.ID_ADDITIONAL_DATA_FIELD_TEMPLATE ||
    id === Tags.ID_MERCHANT_INFORMATION_LANGUAGE_TEMPLATE ||
    (id >= Tags.ID_UNRESERVED_TEMPLATES_RANGE_START && id <= Tags.ID_UNRESERVED_TEMPLATES_RANGE_END)
  );
}
