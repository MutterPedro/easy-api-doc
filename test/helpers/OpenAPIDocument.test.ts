import fs from 'fs';

import { expect } from 'chai';
import faker from 'faker';
import express from 'express';
import supertest from 'supertest';
import sinon from 'sinon';

import OpenAPIDocument from '../../src/helpers/OpenAPIDocument';
import PathBuilder from '../../src/builders/PathBuilder';

describe('OpenAPIDocument', function () {
  beforeEach(function () {
    sinon.restore();
  });

  describe('Sanity tests', function () {
    it('should exists #sanity', function () {
      expect(OpenAPIDocument).not.be.undefined;
      expect(OpenAPIDocument).not.be.null;
    });

    it('should be a class #sanity', function () {
      expect(OpenAPIDocument).instanceOf(Function);
    });
  });

  describe('Unit tests', function () {
    it('should add a new path successfully #unit', async function () {
      const title = faker.hacker.phrase();
      const version = faker.system.semver();
      const doc = new OpenAPIDocument('./api.yaml', {
        title,
        version,
      });
      const path = `/${faker.random.word()}`;

      const stub = sinon.stub(fs, 'writeFile').callsFake((_path, _data, cb) => cb(null));

      const builder = doc.path(path);
      await doc.writeFile();

      expect(builder).to.be.instanceOf(PathBuilder);
      expect(stub).to.be.calledWithMatch('./api.yaml', `${path}:`);
    });

    it('should not override existent paths #unit', async function () {
      const title = faker.hacker.phrase();
      const version = faker.system.semver();
      const doc = new OpenAPIDocument('./api.yaml', {
        title,
        version,
      });
      const path = `/${faker.random.word()}`;

      const stub = sinon.stub(fs, 'writeFile').callsFake((_path, _data, cb) => cb(null));

      doc.path(path).verb('post');
      const builder = doc.path(path);

      await doc.writeFile();

      expect(builder).to.be.instanceOf(PathBuilder);
      expect(stub).to.be.calledWithMatch('./api.yaml', `${path}:`);
      expect(stub).to.be.calledWithMatch('./api.yaml', 'post:');
    });
  });

  describe('Integration tests', function () {
    it('should generate an Open API documentation using Super Agent response successfully #integration', function (done) {
      const path = `/${faker.random.word()}`;
      const body = { foo: faker.random.word() };
      const app = express();
      app.post(path, (_, res) => {
        res.status(200).json(body);
      });

      const stub = sinon.stub(fs, 'writeFile').callsFake((_path, _data, cb) => cb(null));

      const title = faker.hacker.phrase();
      const version = faker.system.semver();
      const doc = new OpenAPIDocument('./api.yaml', {
        title,
        version,
      });

      supertest(app)
        .post(path)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be.null;
          doc.path(path).verb('post').fromSuperAgentResponse(res, faker.lorem.sentence());
          doc.writeFile();

          expect(stub).to.be.calledWithMatch('./api.yaml', `${path}:`);
          expect(stub).to.be.calledWithMatch('./api.yaml', 'post:');
          expect(stub).to.be.calledWithMatch('./api.yaml', '"200":');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'application/json; charset=utf-8:');

          done();
        });
    });

    it('should fail when error to generate an Open API documentation file #integration', async function () {
      const path = `/${faker.random.word()}`;
      const stub = sinon.stub(fs, 'writeFile').callsFake((_path, _data, cb) => cb(new Error('Test error')));

      const title = faker.hacker.phrase();
      const version = faker.system.semver();
      const doc = new OpenAPIDocument('./api.yaml', {
        title,
        version,
      });

      doc.path(path).verb('post');
      doc.path(path).verb('post');
      await expect(doc.writeFile('json')).to.eventually.be.rejected.with.property('message', 'Test error');

      expect(stub).to.be.calledWithMatch('./api.yaml', `"${path}":`);
      expect(stub).to.be.calledWithMatch('./api.yaml', '"post":');
    });

    it('should generate an Open API documentation using request body and tags properties successfully #integration', function (done) {
      const path = `/${faker.random.word()}`;
      const body = { foo: faker.random.word() };
      const reqBody = { bar: faker.random.word() };
      const app = express();
      app.post(path, (_, res) => {
        res.status(201).json(body);
      });

      const stub = sinon.stub(fs, 'writeFile').callsFake((_path, _data, cb) => cb(null));

      const title = faker.hacker.phrase();
      const tags = [faker.random.word()];
      const version = faker.system.semver();
      const doc = new OpenAPIDocument('./api.yaml', {
        title,
        version,
      });

      supertest(app)
        .post(path)
        .send(reqBody)
        .expect(201)
        .end((err, res) => {
          expect(err).to.be.null;
          doc
            .path(path)
            .verb('post', { requestBody: { content: reqBody, mediaType: 'application/json' }, tags })
            .fromSuperAgentResponse(res, faker.lorem.sentence());
          doc.writeFile();

          expect(stub).to.be.calledWithMatch('./api.yaml', `${path}:`);
          expect(stub).to.be.calledWithMatch('./api.yaml', 'post:');
          expect(stub).to.be.calledWithMatch('./api.yaml', '"201":');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'application/json; charset=utf-8:');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'application/json');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'requestBody');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'bar:');

          done();
        });
    });

    it('should generate an Open API documentation with servers defined successfully #integration', function (done) {
      const path = `/${faker.random.word()}`;
      const body = { foo: faker.random.word() };
      const app = express();
      app.post(path, (_, res) => {
        res.status(200).json(body);
      });

      const stub = sinon.stub(fs, 'writeFile').callsFake((_path, _data, cb) => cb(null));

      const title = faker.hacker.phrase();
      const version = faker.system.semver();
      const url = faker.internet.url();
      const doc = new OpenAPIDocument(
        './api.yaml',
        {
          title,
          version,
        },
        [
          {
            url,
          },
        ],
      );

      supertest(app)
        .post(path)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be.null;
          doc.path(path).verb('post').fromSuperAgentResponse(res, faker.lorem.sentence());
          doc.writeFile();

          expect(stub).to.be.calledWithMatch('./api.yaml', `${path}:`);
          expect(stub).to.be.calledWithMatch('./api.yaml', 'post:');
          expect(stub).to.be.calledWithMatch('./api.yaml', '"200":');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'application/json; charset=utf-8:');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'servers:');
          expect(stub).to.be.calledWithMatch('./api.yaml', 'url:');

          done();
        });
    });
  });
});
