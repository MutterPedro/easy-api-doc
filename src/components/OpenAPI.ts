import { DocumentCompositeElement } from './base';
import Path from './Path';
import { JSONPrimitives } from '../types/jsonSchema';
import Info from './Info';
import Server from './Server';
import Component from './Component';
import { ExternalDocumentation } from '../types/documentElements';

export interface OpenAPIProperties {
  openapi: string;
  info: Info;
  paths: { [key: string]: Path };
  servers?: Server[];
  components?: Component[];
  security?: Security[];
  tags?: Tag[];
  externalDocs?: ExternalDocumentation;
}

export interface Tag {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
}

export interface Security {
  [key: string]: string[];
}

export default class OpenAPI extends DocumentCompositeElement<OpenAPIProperties, Path> {
  protected readonly properties: OpenAPIProperties;
  constructor(
    properties: Omit<OpenAPIProperties, 'openapi'>,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super({ ...properties, openapi: '3.0.3' }, specificationExtensions) /* istanbul ignore next */;
    this.properties = { ...properties, openapi: '3.0.3' };
  }

  private formatPathKey(key: string): string {
    return key[0] === '/' ? key : `/${key}`;
  }

  get(key: string): Path | void {
    return this.properties.paths[this.formatPathKey(key)];
  }

  add(key: string, child: Path): void {
    this.properties.paths[this.formatPathKey(key)] = child;
  }

  remove(key: string): void {
    delete this.properties.paths[this.formatPathKey(key)];
  }
}
