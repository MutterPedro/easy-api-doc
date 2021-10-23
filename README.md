# easy-api-doc

Good, updated, and easy API documentation for free and for all! ✊ 📖

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Build Status](https://travis-ci.com/MutterPedro/easy-api-doc.svg?branch=main)](https://travis-ci.com/MutterPedro/easy-api-doc)
[![Coverage Status](https://coveralls.io/repos/github/MutterPedro/easy-api-doc/badge.svg?branch=main)](https://coveralls.io/github/MutterPedro/easy-api-doc?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/MutterPedro/easy-api-doc/badge.svg)](https://snyk.io/test/github/{username}/{repo})
[![Maintainability](https://api.codeclimate.com/v1/badges/37b394afe74ef332e5dc/maintainability)](https://codeclimate.com/github/MutterPedro/easy-api-doc/maintainability)

## Table of content

- [easy-api-doc](#easy-api-doc)
  - [Table of content](#table-of-content)
  - [Installing](#installing)
  - [Motivation](#motivation)
  - [How it works?](#how-it-works)
    - [Document setup](#document-setup)
    - [Path and response definition](#path-and-response-definition)
    - [Building using a super agent response](#building-using-a-super-agent-response)
    - [Building using a native node.js HTTP response](#building-using-a-native-nodejs-http-response)
    - [Building manually](#building-manually)
    - [Generating the document](#generating-the-document)
  - [Contributing](#contributing)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)
  - [Next Steps](#next-steps)

## Installing

```sh
npm i -D easy-api-doc
```

## Motivation

API documentation should be a democratic and accessible thing. It helps others and yourself to understand how to use the API and its possible behaviors more easily. But unfortunately very often the API docs are out of date and neglect, causing more confusion rather than help people to understand how to use the desired API.

For this reason, **easy-api-doc** was created! To help developers to build and maintain a good and updated API document, following the [Open API v3](https://swagger.io/specification/) specification, with a minimum effort way.

## How it works?

**easy-api-doc** exposes an API to create the Open API v3 (**aka Swagger**) document in the **JSON** or **YAML** format. Using a semantic builder approach, you can plug the document definition anywhere you think it fits better inside your code. **For example, you can use it to be a "reward" for the integration tests implemented, this way you will always have an updated and validated API document for free!**

```ts
const doc = new OpenAPIDocument('api.yml', {
  version: '1.0.0',
  title: 'My awesome API',
});

doc
  .path('/status')
  .verb('head', { tags: ['infra'] })
  .fromSuperAgentResponse(res, '');

doc.writeFile();
```

Then you can combine it together with a library like [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) to expose a API docs page.

### Document setup

The definition and possible attributes for the OpenAPIDocument can be found [here]('src/helpers/OpenAPIDocument.ts').

You can have an util file with the following content. Exporting the document instance:

```ts
import { OpenAPIDocument } from 'easy-api-doc';

import { version } from '../../package.json';

export const doc = new OpenAPIDocument('./doc/api-reference.yml', {
  version,
  title: 'My awesome API',
  description: 'Rest API definitions',
});
```

### Path and response definition

With a [OpenAPIDocument]('src/helpers/OpenAPIDocument.ts') instance, you will be able to define a new path using the following method:

```ts
path(path: string, options?: { summary?: string; description?: string }): PathBuilder;
```

And with a PathBuilder instance, you can define a new verb using the following method:

```ts
verb(verb: HttpVerb, options?: ResponseBuilderOptions): ResponseBuilder;
```

And then you can define a possible response using the following methods:

### Building using a super agent response

Many developers like to use the [supertest](https://www.npmjs.com/package/supertest) library to implement theirs integration tests. With **supertest**, you can simulate calls to a given HTTP server and it will respond using [superagent's Response](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/superagent/index.d.ts#L102)! We can take advantage of it to generate our API docs for sure!

```ts
import { expect } from 'chai';
import supertest from 'supertest';
import faker from 'faker';
import { OK } from 'http-status';

import App from '@App';
import { doc } from '@helpers/documentation';

describe('Feature test', function () {
  after(function () {
    doc.writeFile().catch(console.error);
  });

  describe('Integration Tests', function () {
    it('should return 200 OK', function (done) {
      const body = {
        foo: faker.random.word(),
      };

      supertest(app)
        .post('/')
        .send(body)
        .set('Content-type', 'application/json')
        .expect(OK)
        .end((err, res) => {
          expect(err).to.be.null;

          doc
            .path('/')
            .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['tags'] })
            .fromSuperAgentResponse(res, 'test validated');
          done();
        });
    });
  });
});
```

For the previous example, you will end up with something similar to the following YAML file at the end of your test execution, which will be automatically be updated if you change something (bodies, headers, status code, etc).

```yaml
info:
  version: 0.1.0
  title: My awesome API
  description: Rest API definitions
paths:
  /:
    post:
      responses:
        '200':
          description: test validated
          content:
            application/json; charset=utf-8:
              schema:
                type: object
                properties:
                  bar:
                    type: string
                    example: random-word
          headers:
            content-type:
              schema:
                type: string
              example: application/json; charset=utf-8
            content-length:
              schema:
                type: string
              example: '941'
            x-response-time:
              schema:
                type: string
              example: 1.291ms
            date:
              schema:
                type: string
              example: 'Tue, 13 Apr 2021 18:36:09 GMT'
        tags:
          - auth
        requestBody:
          content:
            application/json:
              schema:
                type: object
                properties:
                  foo:
                    type: string
                    example: Quinton_Shanahan26
openapi: 3.0.3
```

### Building using a native node.js HTTP response

If you prefer to keep away from third parties dependencies, **easy-api-docs** also provides to you a way to take advantage of the native node.js HTTP response:

```ts
import { doc } from '@helpers/documentation';

const app = createServer((req, res) => {
  const url = new URL(req.url);

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);

  doc.path(url.pathname).verb(req.method).fromServerResponse(res, 'description', { foo: 'bar' });
});
```

### Building manually

If you just want to build a documentation manually, **easy-api-docs** provides an API to do so:

```ts
const doc = new OpenAPIDocument('./api.yaml', { title, version });

doc
  .path('/foo')
  .verb('get')
  .status(200)
  .withContent('application/json', { example: 'Super cool value', schema: { type: 'string' } });
doc
  .path('/foo')
  .verb('get')
  .status(404)
  .withContent('application/json', { example: 'Not found 😢', schema: { type: 'string' } });
doc
  .path('/bar')
  .verb('post')
  .status(201)
  .withContent('application/json', { example: 'Persisted!', schema: { type: 'number' } });

doc.writeFile();
```

_Note: you should only invoke the `fromServerResponse` method after you set the response status code, otherwise it won't be able to help you that much._

### Generating the document

After you get your [OpenAPIDocument]('src/helpers/OpenAPIDocument.ts') instance, it is simple like calling a function to generate you document file.

```ts
writeFile(format: 'json' | 'yaml' = 'yaml'): Promise<void>
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/MutterPedro/easy-api-doc/tags).

## Authors

- **Pedro Mutter** - _Initial work_ - [MutterPedro](https://github.com/MutterPedro)

See also the list of [contributors](https://github.com/mutterpedro/easy-api-doc/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Next Steps

- [ ] Enable [Security component](https://swagger.io/specification/#security-requirement-object) setup
- [ ] Builder using Axios response
- [ ] Builder using Express request/response
- [x] Builder using native HTTP request/response
- [x] Builder using manual definition
