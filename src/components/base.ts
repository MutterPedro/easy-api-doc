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

  abstract add(key: string, child: T): void;
  abstract remove(key: string): void;
  abstract getChildren(): T[];
}
