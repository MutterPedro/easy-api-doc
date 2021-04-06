import { DocumentElement } from './base';
import { JSONPrimitives } from '../types/jsonSchema';
import { ExternalDocumentation } from '../types/documentElements';

/**
 * References:
 * - https://swagger.io/specification/#schema-object
 * - https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6.4.1
 */
interface SchemaProperties {
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string | RegExp;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: JSONPrimitives[];
  type: 'string' | 'object' | 'number' | 'array' | 'boolean' | 'null';
  allOf?: SchemaProperties[];
  oneOf?: SchemaProperties[];
  anyOf?: SchemaProperties[];
  not?: SchemaProperties;
  items?: SchemaProperties; // valid only when type = array
  properties?: SchemaProperties; // valid only when type = object
  additionalProperties?: boolean | SchemaProperties; // valid only when type = object
  description?: string;
  format?: string;
  default?: JSONPrimitives;
  nullable?: boolean;
  discriminator?: Discriminator;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentation;
  example?: JSONPrimitives;
  deprecated?: boolean;
  $ref?: string;
}

interface Discriminator {
  propertyName: string;
  mapping?: { [key: string]: string };
}

interface XMLObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

export default class Schema extends DocumentElement<SchemaProperties> {
  constructor(
    protected readonly properties: SchemaProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
