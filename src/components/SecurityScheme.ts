import { DocumentElement } from './base';
import { JSONPrimitives } from '../types/jsonSchema';

type SecuritySchemeProperties = {
  description?: string;
} & (
  | {
      type: 'apiKey';
      name: string;
      in: 'query' | 'header' | 'cookie';
    }
  | {
      type: 'http';
      scheme: string;
      bearerFormat?: string;
    }
  | {
      type: 'oauth2';
      flows: {
        implicit?: OAuthFlow;
        password?: OAuthFlow;
        clientCredentials?: OAuthFlow;
        authorizationCode?: OAuthFlow;
      };
    }
  | {
      type: 'openIdConnect';
      openIdConnectUrl: string;
    }
);

interface OAuthFlow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: { [key: string]: string };
}

export default class SecurityScheme extends DocumentElement<SecuritySchemeProperties> {
  constructor(
    protected readonly properties: SecuritySchemeProperties,
    protected readonly specificationExtensions?: { [key: string]: JSONPrimitives },
  ) {
    super(properties, specificationExtensions);
  }
}
