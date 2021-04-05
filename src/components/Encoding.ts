import yaml from 'yaml';

import { Style } from '../types/documentElements';
import { DocumentElement } from './base';
import Header from './Header';

interface EncodingProperties {
  contentType?: string;
  headers?: { [key: string]: Header };
  style?: Style;
  explode?: boolean;
  allowReserved?: boolean;
}

export default class Encoding extends DocumentElement {
  constructor(private readonly properties: EncodingProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
