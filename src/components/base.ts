import yaml from 'yaml';

import { JSONPrimitives } from '../types/jsonSchema';

export interface DocumentGenerator {
  generate(format: 'json' | 'yaml'): string;
}

export abstract class DocumentElement<T> implements DocumentGenerator {
  constructor(
    protected readonly properties: T,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {}

  generate(format: 'json' | 'yaml'): string {
    let props = this.properties;
    if (this.specificationExtensions) {
      props = Object.entries(this.specificationExtensions).reduce((current, [key, value]) => {
        return { ...current, [`x-${key}`]: value };
      }, props);
    }

    if (format === 'json') {
      return JSON.stringify(props);
    }

    return yaml.stringify(props);
  }

  toJSON(): Record<string, unknown> {
    return JSON.parse(this.generate('json'));
  }
}

export abstract class DocumentCompositeElement<T, C> extends DocumentElement<T> implements DocumentGenerator {
  abstract add(key: string, child: C): void;
  abstract remove(key: string): void;
}
