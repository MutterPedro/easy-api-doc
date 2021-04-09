import { expect } from 'chai';
import express from 'express';
import faker from 'faker';
import supertest from 'supertest';

import ResponseBuilder from '../../src/builders/ResponseBuilder';

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
        const description = faker.lorem.sentence();
        const path = `/${faker.random.word()}`;
        const body = { foo: faker.random.word() };
        const app = express();
        app.post(path, (_, res) => {
          res.status(200).json(body);
        });

        supertest(app)
          .post(path)
          .expect(200)
          .end((err, res) => {
            expect(err).to.be.null;

            const response = ResponseBuilder.fromAgentResponse(res, description);
            const generated = response.generate('yaml');

            expect(generated).to.be.a('string');
            expect(generated).to.contains(
              'description: ' +
                description +
                '\ncontent:\n  application/json; charset=utf-8:\n    schema:\n      type: object\n      properties:\n        foo:\n          type: string\n          example: ' +
                body.foo +
                '\n',
            );

            done();
          });
      });

      it('should generate a Response component with nested object JSON file successfully #unit', function (done) {
        const description = faker.lorem.sentence();
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

            const response = ResponseBuilder.fromAgentResponse(res, description);
            const generated = response.generate('yaml');

            expect(generated).to.be.a('string');
            expect(generated).to.contains(
              'description: ' +
                description +
                '\ncontent:\n  application/json; charset=utf-8:\n    schema:\n      type: object\n      properties:\n        foo:\n          type: object\n          properties:\n            bar:\n              type: string\n              example: ' +
                body.foo.bar +
                '\n          example:\n            bar: ' +
                body.foo.bar +
                '\n',
            );

            done();
          });
      });
    });
  });
});
