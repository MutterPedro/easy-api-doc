import { expect } from 'chai';
import faker from 'faker';

import Server from '../../src/components/Server';

describe('Server.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Server).not.be.undefined;
      expect(Server).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Server).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const url = faker.internet.url();

      const server = new Server({ url });
      const generated = server.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"url":"${url}"`);
    });

    it('should generate a YAML file successfully #unit', function () {
      const url = faker.internet.url();

      const server = new Server({ url });
      const generated = server.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`url: ${url}`);
    });
  });
});
