import { createClient } from 'redis';

type RedisConfig = {
  host: string;
  port?: number;
  password?: string;
};

const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string, 10),
  password: process.env.REDIS_PASSWORD as string
};

const client = createClient(redisConfig);
export default client;
