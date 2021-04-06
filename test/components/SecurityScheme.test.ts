import { expect } from 'chai';

import SecurityScheme from '../../src/components/SecurityScheme';

describe('SecurityScheme.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(SecurityScheme).not.be.undefined;
      expect(SecurityScheme).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(SecurityScheme).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const securityScheme = new SecurityScheme({ type: 'apiKey', in: 'header', name: 'X-Token' });
      const generated = securityScheme.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('"type":"apiKey"');
      expect(generated).to.contains('"in":"header"');
      expect(generated).to.contains('"name":"X-Token"');
    });

    it('should generate a YAML file successfully #unit', function () {
      const securityScheme = new SecurityScheme({ type: 'apiKey', in: 'header', name: 'X-Token' });
      const generated = securityScheme.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains('type: apiKey');
      expect(generated).to.contains('in: header');
      expect(generated).to.contains('name: X-Token');
    });
  });
});
