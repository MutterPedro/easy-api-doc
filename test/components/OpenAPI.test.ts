import { expect } from 'chai';
import faker from 'faker';

import MediaType from '../../src/components/MediaType';
import Response from '../../src/components/Response';
import Schema from '../../src/components/Schema';
import OpenAPI from '../../src/components/OpenAPI';
import Operation from '../../src/components/Operation';
import Info from '../../src/components/Info';
import Path from '../../src/components/Path';

describe('OpenAPI.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(OpenAPI).not.be.undefined;
      expect(OpenAPI).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(OpenAPI).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should generate a JSON file successfully #unit', function () {
      const title = faker.random.words(5);
      const version = faker.system.semver();
      const path = '/' + faker.random.word();
      const openAPI = new OpenAPI({
        info: new Info({ title, version }),
        paths: {
          [path]: new Path({
            post: new Operation({
              responses: {
                '200': new Response({
                  content: {
                    'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
                  },
                }),
              },
            }),
          }),
        },
      });
      const generated = openAPI.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"info":{"title":"${title}","version":"${version}"}`);
      expect(generated).to.contains(
        `"paths":{"${path}":{"post":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}}`,
      );
    });

    it('should generate a JSON file with extra paths successfully #unit', function () {
      const title = faker.random.words(5);
      const version = faker.system.semver();
      const path = '/' + faker.random.word();
      const openAPI = new OpenAPI({
        info: new Info({ title, version }),
        paths: {
          [path]: new Path({
            post: new Operation({
              responses: {
                '200': new Response({
                  content: {
                    'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
                  },
                }),
              },
            }),
          }),
        },
      });
      openAPI.add(
        '',
        new Path({
          post: new Operation({
            responses: {
              '202': new Response({
                content: {
                  'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
                },
              }),
            },
          }),
        }),
      );
      const generated = openAPI.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"info":{"title":"${title}","version":"${version}"}`);
      expect(generated).to.contains(
        `"paths":{"${path}":{"post":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}}`,
      );
      expect(generated).to.contains(
        `"/":{"post":{"responses":{"202":{"content":{"application/json":{"schema":{"type":"array"}}}`,
      );
    });

    it('should generate a JSON file with removed extra paths successfully #unit', function () {
      const title = faker.random.words(5);
      const version = faker.system.semver();
      const path = '/' + faker.random.word();
      const openAPI = new OpenAPI({
        info: new Info({ title, version }),
        paths: {
          [path]: new Path({
            post: new Operation({
              responses: {
                '200': new Response({
                  content: {
                    'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
                  },
                }),
              },
            }),
          }),
        },
      });
      openAPI.add(
        '',
        new Path({
          post: new Operation({
            responses: {
              '202': new Response({
                content: {
                  'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
                },
              }),
            },
          }),
        }),
      );
      openAPI.remove('/');
      const generated = openAPI.generate('json');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`"info":{"title":"${title}","version":"${version}"}`);
      expect(generated).to.contains(
        `"paths":{"${path}":{"post":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}}`,
      );
      expect(generated).to.not.contains(
        `"/":{"post":{"responses":{"202":{"content":{"application/json":{"schema":{"type":"array"}}}`,
      );
    });

    it('should generate a YAML file successfully #unit', function () {
      const title = faker.random.words(5);
      const version = faker.system.semver();
      const path = '/' + faker.random.word();
      const openAPI = new OpenAPI({
        info: new Info({ title, version }),
        paths: {
          [path]: new Path({
            post: new Operation({
              responses: {
                '200': new Response({
                  content: {
                    'application/json': new MediaType({ schema: new Schema({ type: 'array' }) }),
                  },
                }),
              },
            }),
          }),
        },
      });
      const generated = openAPI.generate('yaml');

      expect(generated).to.be.a('string');
      expect(generated).to.contains(`info:\n  title: ${title}\n  version: ${version}`);
      expect(generated).to.contains(
        `paths:
  ${path}:
    post:
      responses:
        "200":
          content:
            application/json:
              schema:
                type: array`,
      );
    });
  });
});
