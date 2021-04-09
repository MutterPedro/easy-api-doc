import Path from '../components/Path';
import { HttpVerb } from '../types/http';
import ResponseBuilder from './ResponseBuilder';

export default class PathBuilder {
  private readonly path: Path;

  private constructor(path?: Path) {
    this.path = path || new Path({});
  }

  static create(): PathBuilder {
    return new PathBuilder();
  }

  static from(path: Path): PathBuilder {
    return new PathBuilder(path);
  }

  verb(verb: HttpVerb): ResponseBuilder {
    const operation = this.path.get(verb);
    if (!operation) {
      const builder = ResponseBuilder.create();
      this.path.add(verb, builder.getOperation());

      return builder;
    }

    return ResponseBuilder.from(operation);
  }

  getPath(): Path {
    return this.path;
  }
}
