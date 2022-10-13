import validateLuhn from './utils/luhn';

export const luhn = {
  validate: validateLuhn
};

export const email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export const expirationYear = {
  validate: (value: string | number): boolean => {
    const currentYear: number = new Date().getFullYear();
    return currentYear > +value && +value < (currentYear + 5);
  }
};
