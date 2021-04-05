import yaml from 'yaml';

import { DocumentElement } from './base';

import MediaType from './MediaType';

interface RequestBodyProperties {
  description?: string;
  required?: boolean;
  content?: { [key: string]: MediaType };
}

export default class RequestBody extends DocumentElement {
  constructor(private readonly properties: RequestBodyProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
