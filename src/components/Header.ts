import { JSONPrimitives } from '../types/jsonSchema';
import { Examples, Style } from '../types/documentElements';
import { DocumentElement } from './base';
import Schema from './Schema';
import MediaType from './MediaType';

interface HeaderProperties {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: Style;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Schema;
  example?: JSONPrimitives;
  examples?: { [key: string]: Examples };
  content?: { [key: string]: MediaType };
}

export default class Header extends DocumentElement<HeaderProperties> {
  constructor(
    protected readonly properties: HeaderProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
