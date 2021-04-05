import { JSONPrimitives } from './jsonSchema';

export type HttpVerbs = 'get' | 'post' | 'put' | 'trace' | 'patch' | 'delete' | 'options' | 'head' | 'connect';

export interface Examples {
  summary?: string;
  description?: string;
  value?: JSONPrimitives;
  externalValue?: string;
}

export type Style = 'form' | 'simple' | 'matrix' | 'label' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
