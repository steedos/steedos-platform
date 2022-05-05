import {SQLLang} from 'odata-v4-sql';

export interface SqlOptions {
  useParameters?: boolean;
  type?: SQLLang;
  alias: string;
  version?: string;
}