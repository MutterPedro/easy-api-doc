import { DocumentElement } from './base';
import { JSONPrimitives } from '../types/jsonSchema';
import Schema from './Schema';
import Response from './Response';
import Parameter from './Parameter';
import { Examples } from '../types/documentElements';
import RequestBody from './RequestBody';
import Header from './Header';
import SecurityScheme from './SecurityScheme';
import Link from './Link';
import Path from './Path';

export interface ComponentProperties {
  schemas?: { [key: string]: Schema };
  responses?: { [key: string]: Response };
  parameters?: { [key: string]: Parameter };
  examples?: { [key: string]: Examples };
  requestBodies?: { [key: string]: RequestBody };
  headers?: { [key: string]: Header };
  securitySchemes?: { [key: string]: SecurityScheme };
  links?: { [key: string]: Link };
  callbacks?: { [key: string]: Path };
}

export default class Component extends DocumentElement<ComponentProperties> {
  constructor(
    protected readonly properties: ComponentProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
