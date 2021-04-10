import OpenAPI from '../components/OpenAPI';
import Info, { InfoProperties } from '../components/Info';
import Path from '../components/Path';
import PathBuilder from './PathBuilder';
import Server, { ServerProperties } from '../components/Server';

export default class OpenAPIBuilder {
  private readonly openApi: OpenAPI;

  private constructor(info: InfoProperties, servers?: Server[]) {
    this.openApi = new OpenAPI({ info: new Info(info), paths: {}, servers });
  }

  static create(info: InfoProperties, servers?: ServerProperties[]): OpenAPIBuilder {
    return new OpenAPIBuilder(
      info,
      servers?.map((server) => new Server(server)),
    );
  }

  getOpenAPI(): OpenAPI {
    return this.openApi;
  }

  addPath(path: string, instance: Path): PathBuilder {
    const currentPath = this.openApi.get(path);
    if (currentPath) {
      return PathBuilder.from(currentPath);
    }

    this.openApi.add(path, instance);
    return PathBuilder.from(instance);
  }
}
