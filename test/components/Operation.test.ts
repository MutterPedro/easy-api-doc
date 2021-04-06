import { expect } from 'chai';
import faker from 'faker';

import MediaType from '../../src/components/MediaType';
import Response from '../../src/components/Response';
import Schema from '../../src/components/Schema';
import Operation from '../../src/components/Operation';

describe('Operation.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Operation).not.be.undefined;
      expect(Operation).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Operation).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const summary = faker.random.words(5);
      const operation = new Operation({
        summary,
        responses: {
          '200': new Response({
            content: {
              'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
            },
          }),
        },
      });
      const generated = operation.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"summary":"${summary}"`);
      expect(generated).to.contains('"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}}}}');
    });

    it('should generate a JSON file with extra operations successfully #unit', function () {
      const summary = faker.random.words(5);
      const operation = new Operation({
        summary,
        responses: {
          '200': new Response({
            content: {
              'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
            },
          }),
        },
      });

      operation.add(
        '404',
        new Response({
          content: {
            'application/json': new MediaType({ schema: new Schema({ type: 'object' }) }),
          },
        }),
      );
      const generated = operation.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"summary":"${summary}"`);
      expect(generated).to.contains('"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}');
      expect(generated).to.contains('"404":{"content":{"application/json":{"schema":{"type":"object"}}');
    });

    it('should generate a JSON file with removed extra operations successfully #unit', function () {
      const summary = faker.random.words(5);
      const operation = new Operation({
        summary,
        responses: {
          '200': new Response({
            content: {
              'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
            },
          }),
        },
      });

      operation.add(
        '404',
        new Response({
          content: {
            'application/json': new MediaType({ schema: new Schema({ type: 'object' }) }),
          },
        }),
      );
      operation.remove('404');
      const generated = operation.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"summary":"${summary}"`);
      expect(generated).to.contains('"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}');
      expect(generated).to.not.contains('"404":{"content":{"application/json":{"schema":{"type":"object"}}');
    });

    it('should generate a YAML file successfully #unit', function () {
      const summary = faker.random.words(5);
      const operation = new Operation({
        summary,
        responses: {
          '200': new Response({
            content: {
              'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
            },
          }),
        },
      });
      const generated = operation.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`summary: ${summary}`);
      expect(generated).to.contains(
        'responses:\n  "200":\n    content:\n      application/json:\n        schema:\n          type: array',
      );
    });
  });
});
