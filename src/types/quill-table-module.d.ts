declare module 'quill-table-module' {
  export class TableModule {
    static register(): void;
  }
  
  export interface TableOptions {
    operationMenu?: {
      items?: {
        [key: string]: {
          text: string;
        };
      };
    };
  }
}