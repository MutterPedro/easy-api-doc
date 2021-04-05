import yaml from 'yaml';

import { DocumentElement } from './base';

import MediaType from './MediaType';
import Schema from './Schema';
import { Examples, Style } from '../types/documentElements';
import { JSONPrimitives } from '../types/jsonSchema';

interface ParameterProperties {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
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

export default class Parameter extends DocumentElement {
  constructor(private readonly properties: ParameterProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
