import { DocumentElement } from './base';
import { JSONPrimitives } from '../types/jsonSchema';

interface InfoProperties {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export default class Info extends DocumentElement<InfoProperties> {
  constructor(
    protected readonly properties: InfoProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
