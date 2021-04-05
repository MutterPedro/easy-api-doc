import yaml from 'yaml';

import { DocumentElement } from './base';
import Schema from './Schema';
import Encoding from './Encoding';
import { JSONPrimitives } from '../types/jsonSchema';
import { Examples } from '../types/elements';

interface MediaTypeProperties {
  schema: Schema;
  example?: JSONPrimitives;
  examples?: { [key: string]: Examples };
  enconding?: { [key: string]: Encoding };
}

export default class MediaType extends DocumentElement {
  constructor(private readonly properties: MediaTypeProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
