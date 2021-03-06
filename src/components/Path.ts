import { DocumentCompositeElement } from './base';
import Operation from './Operation';
import Server from './Server';
import Parameter from './Parameter';
import { HttpVerb } from '../types/http';
import { JSONPrimitives } from '../types/jsonSchema';

interface PathProperties {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
  options?: Operation;
  head?: Operation;
  trace?: Operation;
  connect?: Operation;
  servers?: Server[];
  parameters?: Parameter[];
}

export default class Path extends DocumentCompositeElement<PathProperties, Operation> {
  constructor(
    protected readonly properties: PathProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions) /* istanbul ignore next */;
  }

  add(key: HttpVerb, child: Operation): void {
    this.properties[key] = child;
  }

  get(key: HttpVerb): Operation | void {
    return this.properties[key];
  }

  remove(key: HttpVerb): void {
    delete this.properties[key];
  }

  addParameter(parameter: Parameter): void {
    if (!this.properties.parameters) {
      this.properties.parameters = [];
    }

    this.properties.parameters.push(parameter);
  }
}
