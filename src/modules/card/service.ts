type Payload = { id: number, date: number };
interface StatusError extends Error {
  statusCode: number;
}
// type StatusError = typeof Error & { statusCode: number };

export default class Service {
  static async ensureAuthenticated({ event }: any) {
    const authorization: string = event.headers.Authorization || event.headers.authorization;
    if (authorization) {
      const token: string = authorization.replace(/^Bearer /, '');
      if (token && token.length === 16) {
        // Correct validation
        return;
      }
    }

    const error = new Error('Forbidden') as StatusError;
    error.statusCode = 403;
    throw error;
  }

  static async createToken(payload: any) {
    return payload;
  }

  static async getCardById({ id, date }: Payload) {
    return { id, uno: 'DosXXDD', date };
  }
}
