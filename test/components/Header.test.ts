import { expect } from 'chai';
import faker from 'faker';
import yaml from 'yaml';

import Header from '../../src/components/Header';
import Schema from '../../src/components/Schema';

describe('Header.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Header).not.be.undefined;
      expect(Header).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Header).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const example = faker.random.words();

      const header = new Header({ explode: true, style: 'form', example });
      const generated = header.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('"style":"form"');
      expect(generated).to.contains('"explode":true');
      expect(generated).to.contains(`"example":"${example}"`);
    });

    it('should generate a JSON file with schema property successfully #unit', function () {
      const example = faker.random.words();
      const schema = new Schema({ type: 'string' });
      const header = new Header({ explode: true, style: 'form', example, schema });

      const generated = header.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('"style":"form"');
      expect(generated).to.contains('"explode":true');
      expect(generated).to.contains(`"example":"${example}"`);
      expect(generated).to.contains(`"schema":{"type":"string"}`);
    });

    it('should generate a YAML file successfully #unit', function () {
      const example = faker.random.words();

      const header = new Header({ explode: true, style: 'form', example });
      const generated = header.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('style: form');
      expect(generated).to.contains('explode: true');
      expect(generated).to.contains(`example: ${example}`);
      expect(yaml.parse(generated)).to.have.property('example', example);
    });

    it('should generate a YAML file with schema property successfully #unit', function () {
      const example = faker.random.words();

      const schema = new Schema({ type: 'string' });
      const header = new Header({ explode: true, style: 'form', example, schema });
      const generated = header.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('style: form');
      expect(generated).to.contains('explode: true');
      expect(generated).to.contains(`example: ${example}`);
      expect(generated).to.contains('schema:\n  type: string');
      expect(yaml.parse(generated)).to.have.property('example', example);
    });
  });
});
