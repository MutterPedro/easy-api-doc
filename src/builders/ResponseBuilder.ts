import type { Response as AgentResponse } from 'superagent';

import MediaType from '../components/MediaType';
import Schema, { SchemaType } from '../components/Schema';
import Response from '../components/Response';
import { SchemaProperties } from '../components/Schema';
import { JSONPrimitives } from '../types/jsonSchema';

export default class ResponseBuilder {
  private static extractType(item: unknown): SchemaType {
    switch (typeof item) {
      case 'boolean':
        return 'boolean';
      case 'string':
        return 'string';
      case 'undefined':
        return 'null';
      case 'bigint':
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

  static fromAgentResponse(res: AgentResponse, description?: string): Response {
    return new Response({
      description,
      content: {
        [res.headers['content-type']]: new MediaType({
          schema: new Schema(this.extractProperties(res.body)),
        }),
      },
    });
  }
}
