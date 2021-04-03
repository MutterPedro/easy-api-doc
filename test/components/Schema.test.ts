import { expect } from 'chai';
import faker from 'faker';

import Schema from '../../src/components/Schema';

describe('Schema.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Schema).not.be.undefined;
      expect(Schema).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Schema).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const example = faker.random.words();

      const schema = new Schema({ type: 'string', readOnly: true, example });
      const generated = schema.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('"type":"string"');
      expect(generated).to.contains('"readOnly":true');
      expect(generated).to.contains(`"example":"${example}"`);
    });
  });

  // TODO: validate JSON file with extensions
  // TODO: validate YML file generation
  // TODO: validate YML file generation with extensions
});
