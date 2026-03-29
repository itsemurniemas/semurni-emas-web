export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface ApiConfig {
  version: ApiVersion;
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  prefix?: string;
}

export class ApiConfiguration {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  get version(): ApiVersion {
    return this.config.version;
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get defaultHeaders(): Record<string, string> {
    return this.config.defaultHeaders || {};
  }

  get prefix(): string {
    return this.config.prefix || 'public';
  }
}
