import { JSONPrimitives } from 'src/types/jsonSchema';
import { DocumentElement } from './base';

export interface ServerProperties {
  url: string;
  description?: string;
  variables?: { [key: string]: ServerVariables };
}

interface ServerVariables {
  default: string;
  description?: string;
  enum?: string[];
}

export default class Server extends DocumentElement<ServerProperties> {
  constructor(
    protected readonly properties: ServerProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
