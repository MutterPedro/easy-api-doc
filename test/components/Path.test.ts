import { expect } from 'chai';
import faker from 'faker';

import MediaType from '../../src/components/MediaType';
import Response from '../../src/components/Response';
import Schema from '../../src/components/Schema';
import Path from '../../src/components/Path';
import Operation from '../../src/components/Operation';

describe('Path.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(Path).not.be.undefined;
      expect(Path).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(Path).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const summary = faker.random.words(5);
      const path = new Path({
        summary,
        post: new Operation({
          responses: {
            '200': new Response({
              content: {
                'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
              },
            }),
          },
        }),
      });
      const generated = path.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"summary":"${summary}"`);
      expect(generated).to.contains(
        '"post":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}',
      );
    });

    it('should generate a JSON file with extra responses successfully #unit', function () {
      const summary = faker.random.words(5);
      const path = new Path({
        summary,
        post: new Operation({
          responses: {
            '200': new Response({
              content: {
                'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
              },
            }),
          },
        }),
      });

      path.add(
        'get',
        new Operation({
          responses: {
            '200': new Response({
              content: {
                'application/json': new MediaType({ schema: new Schema({ type: 'object' }) }),
              },
            }),
          },
        }),
      );
      const generated = path.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"summary":"${summary}"`);
      expect(generated).to.contains(
        '"post":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}',
      );
      expect(generated).to.contains(
        '"get":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"object"}',
      );
    });

    it('should generate a JSON file with removed extra responses successfully #unit', function () {
      const summary = faker.random.words(5);
      const path = new Path({
        summary,
        post: new Operation({
          responses: {
            '200': new Response({
              content: {
                'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
              },
            }),
          },
        }),
      });

      path.add(
        'get',
        new Operation({
          responses: {
            '200': new Response({
              content: {
                'application/json': new MediaType({ schema: new Schema({ type: 'object' }) }),
              },
            }),
          },
        }),
      );
      path.remove('post');
      const generated = path.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"summary":"${summary}"`);
      expect(generated).to.not.contains(
        '"post":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}',
      );
      expect(generated).to.contains(
        '"get":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"object"}',
      );
    });

    it('should generate a YAML file successfully #unit', function () {
      const summary = faker.random.words(5);
      const path = new Path({
        summary,
        post: new Operation({
          responses: {
            '200': new Response({
              content: {
                'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
              },
            }),
          },
        }),
      });
      const generated = path.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`summary: ${summary}`);
      expect(generated).to.contains(
        'responses:\n    "200":\n      content:\n        application/json:\n          schema:\n            type: array',
      );
    });
  });
});
