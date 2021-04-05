import yaml from 'yaml';

import { DocumentElement } from './base';

interface ServerProperties {
  url: string;
  description?: string;
  variables?: { [key: string]: ServerVariables };
}

interface ServerVariables {
  default: string;
  description?: string;
  enum?: string[];
}

export default class Server extends DocumentElement {
  constructor(private readonly properties: ServerProperties) {
    super();
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
