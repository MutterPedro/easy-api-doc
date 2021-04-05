import { expect } from 'chai';
import faker from 'faker';

import Link from '../../src/components/Link';

describe('Link.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Link).not.be.undefined;
      expect(Link).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Link).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const description = faker.lorem.sentence();

      const link = new Link({ description });
      const generated = link.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"description":"${description}"`);
    });

    it('should generate a YAML file successfully #unit', function () {
      const description = faker.lorem.sentence();

      const link = new Link({ description });
      const generated = link.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`description: ${description}`);
    });
  });
});
