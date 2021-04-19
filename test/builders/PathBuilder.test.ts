import { expect } from 'chai';
import express from 'express';
import faker from 'faker';
import supertest from 'supertest';

import PathBuilder from '../../src/builders/PathBuilder';
import yaml from 'yaml';

describe('PathBuilder.ts', function () {
  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(PathBuilder).not.be.undefined;
      expect(PathBuilder).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(PathBuilder).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    describe('addParameters', function () {
      it('should generate a Path component with parameters JSON file successfully #unit', function (done) {
        const description = faker.random.words(5);
        const summary = faker.random.words(5);
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
          .end((err) => {
            expect(err).to.be.null;

            const generated = PathBuilder.create({ description, summary })
              .addParameters({ in: 'query', name: 'test' })
              .getPath()
              .generate('yaml');
            const object = yaml.parse(generated);

            expect(generated).to.be.a('string');
            expect(object).to.have.property('description', description);
            expect(object).to.have.property('summary', summary);
            expect(object)
              .to.have.property('parameters')
              .deep.equal([{ in: 'query', name: 'test' }]);

            done();
          });
      });
    });
  });
});
