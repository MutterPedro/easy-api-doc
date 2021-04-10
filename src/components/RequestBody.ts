import { DocumentElement } from './base';

import MediaType from './MediaType';
import { JSONPrimitives } from '../types/jsonSchema';

export interface RequestBodyProperties {
  description?: string;
  required?: boolean;
  content?: { [key: string]: MediaType };
}

export default class RequestBody extends DocumentElement<RequestBodyProperties> {
  constructor(
    protected readonly properties: RequestBodyProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
