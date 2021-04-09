import Path from '../components/Path';
import Parameter from '../components/Parameter';
import Server from '../components/Server';
import { HttpVerb } from '../types/http';
import Operation from '../components/Operation';

export default class PathBuilder {
  private constructor(private readonly path: Path) {}

  static createPath(parameters?: Parameter[], summary?: string, description?: string, servers?: Server[]): PathBuilder {
    return new PathBuilder(new Path({ parameters, servers, summary, description }));
  }

  getPath(): Path {
    return this.path;
  }

  // TODO: create a OperationBuilder and return it here
  addOperation(verb: HttpVerb, operation: Operation): this {
    this.path.add(verb, operation);
    return this;
  }

  removeOperation(verb: HttpVerb): this {
    this.path.remove(verb);
    return this;
  }
}
