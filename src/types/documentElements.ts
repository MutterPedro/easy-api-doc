import { JSONPrimitives } from './jsonSchema';

export interface Examples {
  summary?: string;
  description?: string;
  value?: JSONPrimitives;
  externalValue?: string;
}

export type Style = 'form' | 'simple' | 'matrix' | 'label' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';

export interface ExternalDocumentation {
  url: string;
  description?: string;
}
