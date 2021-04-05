import { expect } from 'chai';
import faker from 'faker';
import yaml from 'yaml';

import MediaType from '../../src/components/MediaType';
import Schema from '../../src/components/Schema';

describe('MediaType.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(MediaType).not.be.undefined;
      expect(MediaType).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(MediaType).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const example = { test: faker.random.word() };

      const schema = new Schema({ type: 'object' });
      const mediaType = new MediaType({ schema, example });
      const generated = mediaType.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('"type":"object"');
      expect(generated).to.contains(`"example":`);
      expect(generated).to.contains(JSON.stringify(example));
    });

    it('should generate a YAML file successfully #unit', function () {
      const example = { test: faker.random.word() };

      const schema = new Schema({ type: 'object' });
      const mediaType = new MediaType({ schema, example });
      const generated = mediaType.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('type: object');
      expect(generated).to.contains(`example:`);
      expect(generated).to.contains(yaml.stringify(example));
      expect(yaml.parse(generated)).to.have.property('example').deep.equal(example);
    });
  });
});
