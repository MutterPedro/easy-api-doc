import { expect } from 'chai';
import faker from 'faker';
import yaml from 'yaml';

import Header from '../../src/components/Header';
import Encoding from '../../src/components/Encoding';
import Schema from '../../src/components/Schema';

describe('Encoding.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Encoding).not.be.undefined;
      expect(Encoding).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Encoding).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const encoding = new Encoding({ explode: true, style: 'form' });
      const generated = encoding.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('"style":"form"');
      expect(generated).to.contains('"explode":true');
    });

    it('should generate a JSON file with header property successfully #unit', function () {
      const headerName = `X-${faker.hacker.noun()}-${faker.hacker.adjective()}`;
      const header = new Header({ style: 'matrix' });
      const encoding = new Encoding({
        explode: true,
        style: 'form',
        headers: {
          [headerName]: header,
        },
      });

      const generated = encoding.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('"style":"form"');
      expect(generated).to.contains('"explode":true');
      expect(generated).to.contains(`"headers":{"${headerName}":{"style":"matrix"}}`);
    });

    it('should generate a YAML file successfully #unit', function () {
      const encoding = new Encoding({ explode: true, style: 'form' });
      const generated = encoding.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('style: form');
      expect(generated).to.contains('explode: true');
      expect(yaml.parse(generated)).to.have.property('style', 'form');
    });

    it('should generate a YAML file with header and schema property successfully #unit', function () {
      const headerName = `X-${faker.hacker.noun()}-${faker.hacker.adjective()}`;

      const schema = new Schema({ type: 'string' });
      const header = new Header({ schema });
      const encoding = new Encoding({ explode: true, style: 'form', headers: { [headerName]: header } });
      const generated = encoding.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('style: form');
      expect(generated).to.contains('explode: true');
      expect(generated).to.contains(`headers:
  ${headerName}:
    schema:
      type: string`);
      expect(yaml.parse(generated)).to.have.property('headers');
    });
  });
});
