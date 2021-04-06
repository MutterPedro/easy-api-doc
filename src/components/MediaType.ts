import { DocumentElement } from './base';
import Schema from './Schema';
import Encoding from './Encoding';
import { JSONPrimitives } from '../types/jsonSchema';
import { Examples } from '../types/documentElements';

interface MediaTypeProperties {
  schema: Schema;
  example?: JSONPrimitives;
  examples?: { [key: string]: Examples };
  enconding?: { [key: string]: Encoding };
}

export default class MediaType extends DocumentElement<MediaTypeProperties> {
  constructor(
    protected readonly properties: MediaTypeProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
