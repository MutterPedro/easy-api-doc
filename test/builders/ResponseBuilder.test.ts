import { createServer } from 'http';

import { expect } from 'chai';
import express from 'express';
import faker from 'faker';
import supertest from 'supertest';

import ResponseBuilder from '../../src/builders/ResponseBuilder';
import yaml from 'yaml';

describe('ResponseBuilder.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(ResponseBuilder).not.be.undefined;
      expect(ResponseBuilder).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(ResponseBuilder).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    describe('fromAgentResponse', function () {
      it('should generate a Response component JSON file successfully #unit', function (done) {
        const description = faker.random.words(5);
        const path = `/${faker.random.word()}`;
        const body = {
          foo: faker.random.word(),
          bar: faker.datatype.boolean(),
          baz: faker.datatype.number(),
          foo2: [faker.datatype.number()],
          bar2: null,
        };
        const app = express();
        app.post(path, (_, res) => {
          res.status(200).json(body);
        });

        supertest(app)
          .post(path)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be.null;

            const builder = ResponseBuilder.create();
            builder.fromSuperAgentResponse(res, description);
            const generated = builder.getOperation().generate('yaml');
            const object = yaml.parse(generated);

            expect(generated).to.be.a('string');
            expect(object).to.have.property('responses');
            expect(object.responses).to.have.property('200');
            expect(object.responses['200']).to.have.property('description', description);
            expect(object.responses['200']).to.have.property('headers');
            expect(object.responses['200'])
              .to.have.property('content')
              .deep.equal({
                'application/json; charset=utf-8': {
                  schema: {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                        example: body.foo,
                      },
                      bar: {
                        type: 'boolean',
                        example: body.bar,
                      },
                      baz: {
                        type: 'number',
                        example: body.baz,
                      },
                      foo2: {
                        type: 'array',
                        items: {
                          type: 'number',
                        },
                        example: body.foo2,
                      },
                      bar2: {
                        type: 'null',
                        example: body.bar2,
                      },
                    },
                  },
                },
              });

            done();
          });
      });

      it('should generate a Response component with nested object JSON file successfully #unit', function (done) {
        const description = faker.random.words(5);
        const path = `/${faker.random.word()}`;
        const body = { foo: { bar: faker.random.word() } };
        const app = express();
        app.post(path, (_, res) => {
          res.status(200).json(body);
        });

        supertest(app)
          .post(path)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be.null;

            const builder = ResponseBuilder.create();
            builder.fromSuperAgentResponse(res, description);
            const generated = builder.getOperation().generate('yaml');
            const object = yaml.parse(generated);

            expect(generated).to.be.a('string');
            expect(object).to.have.property('responses');
            expect(object.responses).to.have.property('200');
            expect(object.responses['200']).to.have.property('description', description);
            expect(object.responses['200']).to.have.property('headers');
            expect(object.responses['200'])
              .to.have.property('content')
              .deep.equal({
                'application/json; charset=utf-8': {
                  schema: {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'object',
                        example: {
                          bar: body.foo.bar,
                        },
                        properties: {
                          bar: {
                            type: 'string',
                            example: body.foo.bar,
                          },
                        },
                      },
                    },
                  },
                },
              });

            done();
          });
      });
    });

    describe('fromServerResponse', function () {
      it('should generate a Response component JSON file successfully #unit', function (done) {
        const description = faker.random.words(5);
        const path = `/${faker.random.word()}`;
        const body = {
          foo: faker.random.word(),
        };
        const app = createServer((_, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);

          const builder = ResponseBuilder.create();
          builder.fromServerResponse(res, description, body);
          const generated = builder.getOperation().generate('yaml');
          const object = yaml.parse(generated);

          expect(generated).to.be.a('string');
          expect(object).to.have.property('responses');
          expect(object.responses).to.have.property('200');
          expect(object.responses['200']).to.have.property('description', description);
          expect(object.responses['200']).to.have.property('headers');
          expect(object.responses['200'])
            .to.have.property('content')
            .deep.equal({
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                      example: body.foo,
                    },
                  },
                },
              },
            });

          res.end(JSON.stringify(body));
        });

        supertest(app)
          .post(path)
          .expect(200)
          .end((err) => {
            expect(err).to.be.null;

            done();
          });
      });
    });

    describe('status', function () {
      it('should add a new response to the inner operation #unit', function () {
        const description = faker.random.words(5);
        const example = faker.random.words(10);
        const header = faker.random.words(10);

        const builder = ResponseBuilder.create();
        builder
          .status(200)
          .withContent('application/json', { schema: { type: 'string' }, example })
          .withDescription(description)
          .withHeader('foo', { schema: { type: 'string' }, example: header })
          .withLink('link', { description });

        const generated = builder.getOperation().generate('yaml');
        const object = yaml.parse(generated);

        expect(generated).to.be.a('string');
        expect(object).to.have.property('responses');
        expect(object.responses).to.have.property('200');
        expect(object.responses['200']).to.have.property('description', description);
        expect(object.responses['200']).to.have.property('headers');
        expect(object.responses['200']).to.have.property('links');
        expect(object.responses['200'])
          .to.have.property('content')
          .deep.equal({
            'application/json': {
              example,
              schema: {
                type: 'string',
              },
            },
          });
      });
    });
  });
});
