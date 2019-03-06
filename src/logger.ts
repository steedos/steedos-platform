import { Writable } from 'stream';

/**
 * A Bunyan `Serializer` function.
 * @param input The input to be serialized.
 * **See** {@link https://github.com/cwallsfdc/node-bunyan#serializers|Bunyan Serializers API}
 */
export type Serializer = (input: any) => any; // tslint:disable-line:no-any

/**
 * A collection of named `Serializer`s.
 *
 * **See** {@link https://github.com/cwallsfdc/node-bunyan#serializers|Bunyan Serializers API}
 */
export interface Serializers {
  [key: string]: Serializer;
}

/**
 * The common set of `Logger` options.
 */
export interface LoggerOptions {
    /**
     * The logger name.
     */
    name: string;
    /**
     * The logger's serializers.
     */
    serializers?: Serializers;
    /**
     * Whether or not to log source file, line, and function information.
     */
    src?: boolean;
    /**
     * The desired log level.
     */
    level?: LoggerLevelValue;
    /**
     * A stream to write to.
     */
    stream?: Writable;
    /**
     * An array of streams to write to.
     */
    streams?: LoggerStream[];
  }
  
  /**
   * Standard `Logger` levels.
   *
   * **See** {@link https://github.com/cwallsfdc/node-bunyan#levels|Bunyan Levels}
   */
  export enum LoggerLevel {
    TRACE = 10,
    DEBUG = 20,
    INFO = 30,
    WARN = 40,
    ERROR = 50,
    FATAL = 60
  }
  
  /**
   * A Bunyan stream configuration.
   *
   * @see {@link https://github.com/cwallsfdc/node-bunyan#streams|Bunyan Streams}
   */
  export interface LoggerStream {
    /**
     * The type of stream -- may be inferred from other properties.
     */
    type?: string;
    /**
     * The desired log level for the stream.
     */
    level?: LoggerLevelValue;
    /**
     * The stream to write to.  Mutually exclusive with `path`.
     */
    stream?: Writable;
    /**
     * The name of the stream.
     */
    name?: string;
    /**
     * A log file path to write to.  Mutually exclusive with `stream`.
     */
    path?: string;
    [key: string]: any; // tslint:disable-line:no-any
  }
  
  /**
   * Any numeric `Logger` level.
   */
  export type LoggerLevelValue = LoggerLevel | number;
  