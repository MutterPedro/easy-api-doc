import yaml from 'yaml';

import { DocumentElement } from './base';
import Header from './Header';
import MediaType from './MediaType';
import Link from './Link';

interface ResponseProperties {
  description?: string;
  headers?: { [key: string]: Header };
  content?: { [key: string]: MediaType };
  links?: { [key: string]: Link };
}

export default class Response extends DocumentElement {
  constructor(private readonly properties: ResponseProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
