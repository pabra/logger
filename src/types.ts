import { logLevels } from './levels';

type LogLevels = typeof logLevels;
export type LogLevelName = keyof LogLevels;
export type LoggerNameChain = Readonly<string[]>;
type DataArgs = Readonly<any[]>;
type Log = (message: string, ...args: DataArgs) => void;
export type InternalLogger = {
  readonly name: string;
  readonly nameChain: LoggerNameChain;
  readonly handlers: Handlers;
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
export type Filter = (logger: InternalLogger, message: Message) => boolean;

// a Formatter formats the raw message into a string that will be logged
export type Formatter = (logger: InternalLogger, message: Message) => string;

// a Transporter takes the formatted message and "transports" it to console, filesystem, network, etc
export type Transporter = (
  logger: InternalLogger,
  message: MessageFormatted,
) => void;

// a Handler bundles Filter, Formatter and Transporter
export type Handler = {
  readonly filter?: Filter;
  readonly formatter: Formatter;
  readonly transporter: Transporter;
};
export type Handlers = Readonly<Handler[]>;

export type Logger = { [K in LogLevelName]: Log } & {
  getLogger: GetLoggerOverload;
  getHandlers: () => Handlers;
};

export type GetLoggerWithChain = (
  name: string,
  handlers: Handlers,
  nameChain: LoggerNameChain,
) => Logger;

// wrapper around GetLoggerWithChain that will be exported
export type GetLoggerOverload = {
  (name: string): Logger;
  (name: string, handler: Handler): Logger;
  (name: string, handlers: Handlers): Logger;
};
