import { Style } from '../types/documentElements';
import { DocumentElement } from './base';
import Header from './Header';
import { JSONPrimitives } from '../types/jsonSchema';

interface EncodingProperties {
  contentType?: string;
  headers?: { [key: string]: Header };
  style?: Style;
  explode?: boolean;
  allowReserved?: boolean;
}

export default class Encoding extends DocumentElement<EncodingProperties> {
  constructor(
    protected readonly properties: EncodingProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
