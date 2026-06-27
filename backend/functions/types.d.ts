export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
}

declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(): Promise<T | null>;
    all<T = unknown>(): Promise<{ results?: T[] }>;
    run(): Promise<unknown>;
  }
  interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | string, options?: { httpMetadata?: Record<string, string> }): Promise<unknown>;
    delete(key: string): Promise<void>;
  }
  interface R2ObjectBody {
    body: ReadableStream;
    httpMetadata?: { contentType?: string };
    size: number;
  }
}
