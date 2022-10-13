export const GetCardById = {
  id: { type: 'integer', required: true },
  date: { type: 'integer', format: 'luhn' }
};

export const CreateToken = {
  card_number: {
    type: 'string', format: 'luhn', minLength: 13, maxLength: 16, required: true
  },
  cvv: { type: 'string', minLength: 3, maxLength: 4 },
  expiration_month: { type: 'integer', minimum: 1, maximum: 12 },
  expiration_year: { type: 'integer', format: 'expirationYear' },
  email: {
    type: 'string', format: 'email', minLength: 5, maxLength: 10
  }
};
