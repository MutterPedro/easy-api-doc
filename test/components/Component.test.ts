import { expect } from 'chai';
import faker from 'faker';

import Component from '../../src/components/Component';
import Schema from '../../src/components/Schema';

describe('Component.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Component).not.be.undefined;
      expect(Component).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Component).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const schemaKey = faker.random.word();
      const component = new Component({ schemas: { [schemaKey]: new Schema({ type: 'string' }) } });

      const generated = component.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"schemas":{"${schemaKey}":{"type":"string"}}`);
    });

    it('should generate a YAML file successfully #unit', function () {
      const schemaKey = faker.random.word();
      const component = new Component({ schemas: { [schemaKey]: new Schema({ type: 'string' }) } });

      const generated = component.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`schemas:\n  ${schemaKey}:\n    type: string`);
    });
  });
});
