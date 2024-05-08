import { logLevels } from './levels';

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [Key in string]: JsonValue };
type JsonArray = JsonValue[];
export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

type LogLevels = typeof logLevels;
export type LogLevelName = keyof LogLevels;
export type LogLevelValue = LogLevels[keyof LogLevels]['value'];
export type LogLevelSeverity = LogLevels[keyof LogLevels]['severity'];
export type LoggerNameChain = Readonly<string[]>;
type DataArgs = Readonly<any[]>;
type Log = (message: string, ...args: DataArgs) => void;
export type InternalLogger<T extends JsonValue> = {
  readonly name: string;
  readonly nameChain: LoggerNameChain;
  readonly handlers: Handlers<T>;
};
export interface Message {
  readonly messageRaw: string;
  readonly data: DataArgs;
  readonly level: LogLevelName;
}
export interface MessageFormatted extends Message {
  readonly messageFormatted: string;
}

// a Filter decides if current call should be logged or not
export type Filter = <T extends JsonValue>(
  logger: InternalLogger<T>,
  message: Message,
) => boolean;

// a Formatter formats the raw message into a string that will be logged
export type Formatter<T extends JsonValue> = (
  logger: InternalLogger<T>,
  message: Message,
) => T;

// a Transporter takes the formatted message and "transports" it to console, filesystem, network, etc
export type Transporter<T extends JsonValue> = (
  logger: InternalLogger<T>,
  message: Message,
  messageFormatted: T,
) => void;

// a Handler bundles Filter, Formatter and Transporter
export type Handler<T extends JsonValue> = {
  readonly filter?: Filter;
  readonly formatter: Formatter<T>;
  readonly transporter: Transporter<T>;
};
export type Handlers<T extends JsonValue> = Handler<T>[];

export type Logger = { [K in LogLevelName]: Log } & {
  getLogger: GetLoggerOverload;
  getHandlers: <T extends JsonValue>() => Handlers<T>;
};

export type GetLoggerWithChain = <T extends JsonValue>(
  name: string,
  handlers: Handlers<T>,
  nameChain: LoggerNameChain,
) => Logger;

// wrapper around GetLoggerWithChain that will be exported
export type GetLoggerOverload = {
  (name: string): Logger;
  <T extends JsonValue>(name: string, handler: Handler<T>): Logger;
  <T extends JsonValue>(name: string, handlers: Handlers<T>): Logger;
};
