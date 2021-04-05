export interface DocumentGenerator {
  generate(format: 'json' | 'yaml'): string;
}

export abstract class DocumentElement implements DocumentGenerator {
  abstract generate(format: 'json' | 'yaml'): string;

  toJSON(): Record<string, unknown> {
    return JSON.parse(this.generate('json'));
  }
}

export abstract class DocumentCompositeElement<T> extends DocumentElement implements DocumentGenerator {
  abstract generate(format: 'json' | 'yaml'): string;

  abstract add(child: T): void;
  abstract remove(child: T): void;
  abstract getChildren(): T[];
}
