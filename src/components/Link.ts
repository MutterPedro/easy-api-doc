import yaml from 'yaml';

import { DocumentElement } from './base';
import { JSONPrimitives } from '../types/jsonSchema';
import Server from './Server';

interface LinkProperties {
  operationRef?: string;
  operationId?: string;
  parameters?: { [key: string]: JSONPrimitives };
  requestBody?: JSONPrimitives;
  description?: string;
  server?: Server;
}

export default class Link extends DocumentElement {
  constructor(private readonly properties: LinkProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
