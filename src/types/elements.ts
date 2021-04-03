export interface Api {
  baseUrl: string;
  paths: Path[];
}

export interface Path {
  path: string;
  handlers: Handler[];
}

export type HttpVerbs = 'get' | 'post' | 'put' | 'trace' | 'patch' | 'delete' | 'options' | 'head' | 'connect';

export interface Handler {
  verb: HttpVerbs;
  res: Array<{
    body: Record<string, unknown>;
    headers: Record<string, unknown>;
    status: number;
  }>;
  req: {
    body?: Record<string, unknown>;
    query?: Record<string, unknown>;
    params?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  };
  tags?: string[];
}
