import redis from '@/core/redis';
import generateId from '@/core/utils/id';

type PCreateToken = {
  card_number: string,
  cvv: number,
  expiration_month: number,
  expiration_year: number,
  email: string
};

type PGetCardById = {
  token: string
};

interface StatusError extends Error {
  statusCode: number;
}

const TTL = 900; // 15 minutes
const KEY_SIZE = 16; // 16 characters
const AUTH_TOKEN_SIZE = 16;

export default class Service {
  static async ensureAuthenticated({ event }: any) {
    const authorization: string = event.headers.Authorization || event.headers.authorization;
    if (authorization) {
      const token: string = authorization.replace(/^Bearer /, '');
      if (token && token.length === AUTH_TOKEN_SIZE) {
        // Correct validation
        return;
      }
    }

    const error = new Error('Forbidden') as StatusError;
    error.statusCode = 403;
    throw error;
  }

  static async createToken(payload: PCreateToken): Promise<string> {
    const key: string = generateId(KEY_SIZE);
    await redis.set(key, JSON.stringify(payload), { EX: TTL, NX: true });
    return key;
  }

  static async getCardById({ token }: PGetCardById): Promise<Object> {
    const data = await redis.get(token);
    if (data === null) {
      throw new Error('The token is already expired, please refill generate it again');
    }
    return { ...JSON.parse(data), cvv: undefined };
  }
}
