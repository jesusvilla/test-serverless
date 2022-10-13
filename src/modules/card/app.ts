import NaturalRouter from '@/core/natural-router';
import { email, expirationYear, luhn } from '@/core/validator.format';

import { CreateToken, GetCardById } from './schemas';
import Service from './service';

const app = new NaturalRouter();
// Load only the necessary formats
app.validator.addFormats({ email, luhn, expirationYear });

app
  .before(Service.ensureAuthenticated)
  .post('/tokens', Service.createToken, CreateToken) // only work with Authorization: Bearer <Hash16Size>
  .get('/cards/{token}', Service.getCardById, GetCardById); // only work with Authorization: Bearer <Hash16Size>

export const handler = app.run();
