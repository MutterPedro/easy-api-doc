import { expect } from 'chai';
import faker from 'faker';

import Response from '../../src/components/Response';
import MediaType from '../../src/components/MediaType';
import Schema from '../../src/components/Schema';
import Header from '../../src/components/Header';
import Link from '../../src/components/Link';

describe('Response.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Response).not.be.undefined;
      expect(Response).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Response).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const description = faker.lorem.sentence();
      const content = {
        'application/json': new MediaType({ schema: new Schema({ type: 'object' }) }),
      };
      const headers = {
        'X-Super-Header': new Header({ allowEmptyValue: true }),
      };
      const links = {
        address: new Link({}),
      };
      const response = new Response({ description, content, headers, links });
      const generated = response.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"description":"${description}"`);
      expect(generated).to.contains('"content":{"application/json":{"schema":{"type":"object"}}}');
      expect(generated).to.contains('"headers":{"X-Super-Header":{"allowEmptyValue":true}}');
      expect(generated).to.contains('"links":{"address":{}}');
    });

    it('should generate a YAML file successfully #unit', function () {
      const description = faker.lorem.sentence();
      const content = {
        'application/json': new MediaType({ schema: new Schema({ type: 'object' }) }),
      };
      const headers = {
        'X-Super-Header': new Header({ allowEmptyValue: true }),
      };
      const links = {
        address: new Link({}),
      };
      const response = new Response({ description, content, headers, links });
      const generated = response.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`description: ${description}`);
      expect(generated).to.contains('content:\n  application/json:\n    schema:\n      type: object');
      expect(generated).to.contains('headers:\n  X-Super-Header:\n    allowEmptyValue: true');
      expect(generated).to.contains('links:\n  address: {}');
    });
  });
});
