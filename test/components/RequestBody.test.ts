import { expect } from 'chai';
import faker from 'faker';

import RequestBody from '../../src/components/RequestBody';

describe('RequestBody.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(RequestBody).not.be.undefined;
      expect(RequestBody).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(RequestBody).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const description = faker.random.words(5);

      const requestBody = new RequestBody({ description });
      const generated = requestBody.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"description":"${description}"`);
    });

    it('should generate a YAML file successfully #unit', function () {
      const description = faker.random.words(5);

      const requestBody = new RequestBody({ description });
      const generated = requestBody.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`description: ${description}`);
    });
  });
});
