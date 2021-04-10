import Path from '../components/Path';
import { HttpVerb } from '../types/http';
import ResponseBuilder, { ResponseBuilderOptions } from './ResponseBuilder';
import Parameter, { ParameterProperties } from '../components/Parameter';

export default class PathBuilder {
  private readonly path: Path;

  private constructor(path?: Path) {
    this.path = path || new Path({});
  }

  static create(options?: { summary?: string; description?: string }): PathBuilder {
    if (options) {
      return new PathBuilder(new Path(options));
    }

    return new PathBuilder();
  }

  static from(path: Path): PathBuilder {
    return new PathBuilder(path);
  }

  addParameters(...parameters: Omit<ParameterProperties, 'content' | 'schema'>[]): this {
    parameters.forEach((param) => this.path.addParameter(new Parameter(param)));

    return this;
  }

  verb(verb: HttpVerb, options?: ResponseBuilderOptions): ResponseBuilder {
    const operation = this.path.get(verb);
    if (!operation) {
      const builder = ResponseBuilder.create(options);
      this.path.add(verb, builder.getOperation());

      return builder;
    }

    return ResponseBuilder.from(operation);
  }

  getPath(): Path {
    return this.path;
  }
}
