import fs from 'fs';

import { InfoProperties } from '../components/Info';
import OpenAPIBuilder from '../builders/OpenAPIBuilder';
import PathBuilder from '../builders/PathBuilder';
import { ServerProperties } from '../components/Server';

export default class OpenAPIDocument {
  private readonly openAPIBuilder: OpenAPIBuilder;

  constructor(private readonly filename: string, info: InfoProperties, servers?: ServerProperties[]) {
    this.openAPIBuilder = OpenAPIBuilder.create(info, servers);
  }

  path(path: string, options?: { summary?: string; description?: string }): PathBuilder {
    return this.openAPIBuilder.addPath(path, PathBuilder.create(options).getPath());
  }

  writeFile(format: 'json' | 'yaml' = 'yaml'): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filename, this.openAPIBuilder.getOpenAPI().generate(format), (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}
