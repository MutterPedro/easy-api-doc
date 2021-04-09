import { DocumentCompositeElement } from './base';
import Response from './Response';
import Parameter from './Parameter';
import { ExternalDocumentation } from '../types/documentElements';
import RequestBody from './RequestBody';
import { HttpStatusCode } from '../types/http';
import Server from './Server';
import Path from './Path';
import { JSONPrimitives } from '../types/jsonSchema';

export interface OperationProperties {
  responses: Partial<Record<HttpStatusCode, Response>> & { default?: Response };
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  callbacks?: { [key: string]: Path };
  deprecated?: boolean;
  security?: { [key: string]: string[] };
  servers?: Server[];
}

export default class Operation extends DocumentCompositeElement<OperationProperties, Response> {
  private children: Map<string, Response | undefined>;

  constructor(
    protected readonly properties: OperationProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions) /* istanbul ignore next */;

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
}
