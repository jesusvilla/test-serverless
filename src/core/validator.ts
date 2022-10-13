import type { JSONSchemaType } from 'ajv';
import Ajv from 'ajv';

export default class Validator {
  private ctx: Ajv;

  static Error: any = Ajv.ValidationError;

  constructor() {
    this.ctx = new Ajv({ passContext: true, coerceTypes: true });
  }

  compile(schema: any): any {
    const standardSchema = {
      $async: true, type: 'object', properties: {}, required: []
    } as any;
    Object.keys(schema).forEach((key) => {
      standardSchema.properties[key] = { ...schema[key] };
      if (standardSchema.properties[key].required) {
        standardSchema.required.push(key);
        delete standardSchema.properties[key].required;
      }
    });
    type SchemaType = JSONSchemaType<typeof standardSchema>;
    return this.ctx.compile<SchemaType>(standardSchema);
  }

  addFormat(name: string, schema: any) {
    return this.ctx.addFormat(name, schema);
  }

  addFormats(formats: any) {
    for (const key of Object.keys(formats)) {
      const format = formats[key];
      this.ctx.addFormat(key, format);
    }
  }
}
