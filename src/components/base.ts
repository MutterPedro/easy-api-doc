export interface DocumentElement {
  generate(format: 'json' | 'yaml'): string;
}

export abstract class CompositeElement<T> implements DocumentElement {
  abstract generate(format: 'json' | 'yaml'): string;
  abstract add(child: T): void;
  abstract remove(child: T): void;
  abstract getChildren(): T[];
}
