/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ServerResponse } from 'http';

import type { Response as AgentResponse } from 'superagent';

import MediaType from '../components/MediaType';
import Schema, { SchemaType } from '../components/Schema';
import Response from '../components/Response';
import { SchemaProperties } from '../components/Schema';
import { JSONPrimitives } from '../types/jsonSchema';
import Header from '../components/Header';
import { HttpStatusCode } from '../types/http';
import Operation from '../components/Operation';
import { RequestBodyProperties } from '../components/RequestBody';
import RequestBody from '../components/RequestBody';
import StatusBuilder from './StatusBuilder';

export interface ResponseBuilderOptions {
  requestBody?: Omit<RequestBodyProperties, 'content'> & { content: any; mediaType: string };
  tags?: string[];
}

export default class ResponseBuilder {
  private readonly operation: Operation;

  private static extractType(item: unknown): SchemaType {
    if (item === undefined || item === null) {
      return 'null';
    }

    switch (typeof item) {
      case 'boolean':
        return 'boolean';
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      default:
        return Array.isArray(item) ? 'array' : 'object';
    }
  }

  private static extractProperties(item: any): SchemaProperties {
    const schemaType = this.extractType(item);
    const schemaProperties: SchemaProperties = {
      type: schemaType,
    };

    if (schemaType === 'array') {
      schemaProperties.items = {
        type: this.extractType(item[0]),
      };
    }

    if (schemaType === 'object') {
      schemaProperties.properties = Object.entries<JSONPrimitives>(item).reduce<SchemaProperties['properties']>(
        (props, [key, example]) => ({ ...props, [key]: { ...this.extractProperties(item[key]), example } }),
        {},
      );
    }

    return schemaProperties;
  }

  private constructor(operation?: Operation) {
    this.operation = operation || new Operation({ responses: {} });
  }

  getOperation(): Operation {
    return this.operation;
  }

  status(status: number): StatusBuilder {
    const builder = StatusBuilder.create();

    this.operation.add(status.toString() as HttpStatusCode, builder.getResponse());

    return builder;
  }

  static create(options?: ResponseBuilderOptions): ResponseBuilder {
    return new ResponseBuilder(
      new Operation({
        responses: {},
        tags: options?.tags,
        requestBody:
          options?.requestBody &&
          new RequestBody({
            description: options.requestBody.description,
            required: options.requestBody.required,
            content: {
              [options.requestBody.mediaType]: new MediaType({
                schema: new Schema(this.extractProperties(options.requestBody.content)),
              }),
            },
          }),
      }),
    );
  }

  static from(operation: Operation): ResponseBuilder {
    return new ResponseBuilder(operation);
  }

  fromSuperAgentResponse(res: AgentResponse, description: string): void {
    const mediaType = res.headers['content-type'] || '*/*';

    this.operation.add(
      res.status.toString() as HttpStatusCode,
      new Response({
        description,
        content: {
          [mediaType]: new MediaType({
            schema: new Schema(ResponseBuilder.extractProperties(res.body)),
          }),
        },
        headers: Object.entries<JSONPrimitives>(res.headers).reduce<{ [key: string]: Header }>(
          (headers, [key, example]) => ({
            ...headers,
            [key]: new Header({
              schema: new Schema(ResponseBuilder.extractProperties(example)),
              example,
            }),
          }),
          {},
        ),
      }),
    );
  }

  fromServerResponse(res: ServerResponse, description: string, body?: unknown): void {
    const mediaType = res.getHeader('content-type')?.toString() || '*/*';

    this.operation.add(
      res.statusCode.toString() as HttpStatusCode,
      new Response({
        description,
        content: {
          [mediaType]: new MediaType({
            schema: new Schema(ResponseBuilder.extractProperties(body)),
          }),
        },
        headers: res.getHeaderNames().reduce<{ [key: string]: Header }>(
          (headers, key) => ({
            ...headers,
            [key]: new Header({
              schema: new Schema(ResponseBuilder.extractProperties(res.getHeader(key))),
              example: res.getHeader(key),
            }),
          }),
          {},
        ),
      }),
    );
  }
}
