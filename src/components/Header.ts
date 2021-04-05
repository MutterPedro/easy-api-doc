import { JSONPrimitives } from '../types/jsonSchema';
import { Examples, Style } from '../types/elements';
import { DocumentElement } from './base';
import Schema from './Schema';
import MediaType from './MediaType';
import yaml from 'yaml';

interface HeaderProperties {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: Style;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Schema;
  example?: JSONPrimitives;
  examples?: { [key: string]: Examples };
  content?: { [key: string]: MediaType };
}

export default class Header extends DocumentElement {
  constructor(private readonly properties: HeaderProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
