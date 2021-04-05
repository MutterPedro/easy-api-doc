export abstract class DocumentElement {
  abstract generate(format: 'json' | 'yaml'): string;

  toJSON(): Record<string, unknown> {
    return JSON.parse(this.generate('json'));
  }
}

export abstract class CompositeElement<T> extends DocumentElement {
  abstract generate(format: 'json' | 'yaml'): string;
  abstract toJSON(): Record<string, unknown>;

  abstract add(child: T): void;
  abstract remove(child: T): void;
  abstract getChildren(): T[];
}
