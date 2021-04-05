import yaml from 'yaml';

import { DocumentCompositeElement } from './base';
import Response from './Response';
import Parameter from './Parameter';
import { ExternalDocumentation } from '../types/documentElements';
import RequestBody from './RequestBody';
import { HttpStatusCode } from '../types/http';
import { PathLike } from 'node:fs';
import Server from './Server';

interface OperationProperties {
  responses: Partial<Record<HttpStatusCode, Response>> & { default?: Response };
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  callbacks?: { [key: string]: PathLike };
  deprecated?: boolean;
  security?: { [key: string]: string[] };
  servers?: Server[];
}

export default class Operation extends DocumentCompositeElement<Response> {
  private children: Map<string, Response | undefined>;

  constructor(private readonly properties: OperationProperties) {
    super();

    this.children = new Map(Object.entries(this.properties.responses));
  }

  add(key: HttpStatusCode, child: Response): void {
    this.properties.responses[key] = child;
    this.children.set(key, child);
  }

  remove(key: HttpStatusCode): void {
    this.children.delete(key);
    this.properties.responses = {};
    for (const [code, response] of this.children.entries()) {
      this.properties.responses[code as HttpStatusCode] = response;
    }
  }

  getChildren(): Response[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Array.from(this.children.values()).filter(Boolean);
  }

  generate(format: 'json' | 'yaml'): string {
    if (format === 'json') {
      return JSON.stringify(this.properties);
    }

    return yaml.stringify(this.properties);
  }
}
