import OpenAPI from '../components/OpenAPI';
import Info, { InfoProperties } from '../components/Info';
import Path from '../components/Path';
import PathBuilder from './PathBuilder';

export default class OpenAPIBuilder {
  private readonly openApi: OpenAPI;

  private constructor(info: InfoProperties) {
    this.openApi = new OpenAPI({ info: new Info(info), paths: {} });
  }

  static create(info: InfoProperties): OpenAPIBuilder {
    return new OpenAPIBuilder(info);
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
