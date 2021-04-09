import fs from 'fs';

import { InfoProperties } from '../components/Info';
import OpenAPIBuilder from '../builders/OpenAPIBuilder';
import PathBuilder from '../builders/PathBuilder';

export default class OpenAPIDocument {
  private readonly openAPIBuilder: OpenAPIBuilder;

  constructor(private readonly filename: string, info: InfoProperties) {
    this.openAPIBuilder = OpenAPIBuilder.create(info);
  }

  path(path: string): PathBuilder {
    return this.openAPIBuilder.addPath(path, PathBuilder.create().getPath());
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
