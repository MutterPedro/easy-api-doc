import { expect } from 'chai';
import faker from 'faker';

import Parameter from '../../src/components/Parameter';

describe('Parameter.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Parameter).not.be.undefined;
      expect(Parameter).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Parameter).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const name = faker.random.word();

      const parameter = new Parameter({ name, in: 'query' });
      const generated = parameter.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"name":"${name}"`);
      expect(generated).to.contains('"in":"query"');
    });

    it('should generate a YAML file successfully #unit', function () {
      const name = faker.random.word();

      const parameter = new Parameter({ name, in: 'query' });
      const generated = parameter.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`name: ${name}`);
      expect(generated).to.contains('in: query');
    });
  });
});
