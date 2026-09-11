import 'express-serve-static-core';
declare module 'express-serve-static-core' { interface Request { user?: any } }
declare module 'pg' {
  export class Pool { constructor(config?: any); query(text: string, values?: any[]): Promise<any>; connect(): Promise<any>; }
  export interface PoolClient { query(text: string, values?: any[]): Promise<any>; release(): void; }
}
