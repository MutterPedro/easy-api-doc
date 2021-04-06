import { expect } from 'chai';
import faker from 'faker';

import Info from '../../src/components/Info';

describe('Info.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Info).not.be.undefined;
      expect(Info).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Info).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const title = faker.random.words(5);
      const version = faker.system.semver();

      const info = new Info({ title, version });
      const generated = info.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"title":"${title}"`);
      expect(generated).to.contains(`"version":"${version}"`);
    });

    it('should generate a YAML file successfully #unit', function () {
      const title = faker.random.words(5);
      const version = faker.system.semver();

      const info = new Info({ title, version });
      const generated = info.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`title: ${title}`);
      expect(generated).to.contains(`version: ${version}`);
    });
  });
});
