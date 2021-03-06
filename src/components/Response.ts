import { DocumentElement } from './base';
import Header from './Header';
import MediaType from './MediaType';
import Link from './Link';
import { JSONPrimitives } from '../types/jsonSchema';

export interface ResponseProperties {
  description?: string;
  headers?: { [key: string]: Header };
  content?: { [key: string]: MediaType };
  links?: { [key: string]: Link };
}

export default class Response extends DocumentElement<ResponseProperties> {
  constructor(
    protected properties: ResponseProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }

  update(properties: ResponseProperties): void {
    this.properties = { ...this.properties, ...properties };
  }
}
