import { DocumentElement } from './base';
import { JSONPrimitives } from '../types/jsonSchema';
import Server from './Server';

export interface LinkProperties {
  operationRef?: string;
  operationId?: string;
  parameters?: { [key: string]: JSONPrimitives };
  requestBody?: JSONPrimitives;
  description?: string;
  server?: Server;
}

export default class Link extends DocumentElement<LinkProperties> {
  constructor(
    protected readonly properties: LinkProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
