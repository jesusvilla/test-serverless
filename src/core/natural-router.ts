/* This MiniRouter has been created specifically for this test (Inspired in NaturalRouter) */
/* NaturalRouter & NaturalFramework have been created by me: https://github.com/jesusvilla/natural */
import Logger from './logger';
import Validator from './validator';

const HEADERS = {
  'Content-Type': 'application/json',
};
const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const STATUS_INVALID_REQUEST = 400;
// const STATUS_FORBIDDEN = 403;

const FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

type Event = {
  routeKey: string;
  body: string;
  isBase64Encoded: boolean;
  headers: any;
  pathParameters: Object;
  queryStringParameters: Object;
};

export type RouterCb = (
  (
    payload: any,
    context: {
      event: Event,
      context: Object,
      payload: Object,
      body: null
    }
  ) => Promise<Object>
) & { validate?: any };

type MiddlewareCb = (
  (
    context: {
      event: Event,
      context: Object,
      payload: Object,
      body: Object | null
    }
  ) => Promise<void>
) & { validate?: any };

interface RouterStore {
  [key: string]: RouterCb;
}

const getBody = (event: Event) => {
  if (!event.body) {
    return {};
  }

  let body;
  if (event.isBase64Encoded) {
    const buff = Buffer.from(event.body, 'base64');
    body = buff.toString('utf8');
  } else {
    body = event.body;
  }

  if (
    event.headers['Content-Type'] === FORM_URL_ENCODED
      || event.headers['content-type'] === FORM_URL_ENCODED
  ) {
    const urlParams = new URLSearchParams(body);
    const form: any = {};
    urlParams.forEach((value, key) => {
      form[key] = value;
    });
    return form;
  }

  return JSON.parse(body);
};

export default class NaturalRouter {
  private routes: RouterStore = {};

  private preHandlers: MiddlewareCb[] = [];

  private postHandlers: MiddlewareCb[] = [];

  validator: Validator = new Validator();

  private route(method: string, path: string, cb: RouterCb, schema?: any) {
    if (schema) {
      // If the parameter exists then assign a schema validator to the function payload
      cb.validate = this.validator.compile(schema);
    }
    this.routes[`${method} ${path}`] = cb;
    return this;
  }

  get(path: string, cb: RouterCb, schema?: Object): NaturalRouter {
    return this.route('GET', path, cb, schema);
  }

  post(path: string, cb: RouterCb, schema?: Object): NaturalRouter {
    return this.route('POST', path, cb, schema);
  }

  put(path: string, cb: RouterCb, schema?: Object): NaturalRouter {
    return this.route('PUT', path, cb, schema);
  }

  patch(path: string, cb: RouterCb, schema?: Object): NaturalRouter {
    return this.route('PATCH', path, cb, schema);
  }

  delete(path: string, cb: RouterCb, schema?: Object): NaturalRouter {
    return this.route('DELETE', path, cb, schema);
  }

  options(path: string, cb: RouterCb, schema?: Object): NaturalRouter {
    return this.route('OPTIONS', path, cb, schema);
  }

  before(cb: MiddlewareCb): NaturalRouter {
    this.preHandlers.push(cb);
    return this;
  }

  after(cb: MiddlewareCb): NaturalRouter {
    this.postHandlers.push(cb);
    return this;
  }

  run(): Function {
    return async (event: Event, context: Object) => {
      let body;
      let statusCode;

      const self = {
        event,
        context,
        payload: {
          ...(event.pathParameters || {}),
          ...(event.queryStringParameters || {}),
          ...(getBody(event)),
        } as Object,
        body: null as any
      };

      if (process.env.NODE_ENV === 'development') {
        Logger.info('Request:payload', self.payload);
      }

      try {
        const handler = this.routes[event.routeKey];
        if (handler === undefined) {
          const error: any = new Error(`Unsupported route: "${event.routeKey}"`);
          error.statusCode = STATUS_NOT_FOUND;
          throw error;
        }

        if (handler.validate !== undefined) {
          // autocast types
          await handler.validate(self.payload);
        }

        statusCode = STATUS_OK;
        for (const middleware of this.preHandlers) {
          await middleware(self);
        }
        body = await handler(self.payload, self);
        self.body = body;
        for (const middleware of this.postHandlers) {
          await middleware(self);
        }
      } catch (error: any) {
        Logger.error(error);
        statusCode = error.statusCode || STATUS_INVALID_REQUEST;
        if (error instanceof Validator.Error) {
          body = {
            errors: error.errors.map((e: any) => ({
              parameter: String(e.instancePath).replace('/', ''),
              message: e.message
            }))
          };
        } else {
          body = error.message;
        }
      } finally {
        body = JSON.stringify({ data: body });
      }

      return {
        statusCode,
        body,
        headers: HEADERS,
      };
    };
  }
}
