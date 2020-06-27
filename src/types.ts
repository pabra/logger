import { logLevels } from './levels';

type LogLevels = typeof logLevels;
type LoggerNameChain = Readonly<string[]>;
type DataArgs<T> = Readonly<T[]>;
type Log = <Data extends any>(message: string, ...args: DataArgs<Data>) => void;
type Logger = {
  readonly name: string;
  readonly nameChain: LoggerNameChain;
};
interface Message {
  readonly raw: string;
  readonly data: DataArgs<any>;
  readonly level: keyof LogLevels;
}
interface MessageFormatted extends Message {
  readonly formatted: string;
}

// a Filter decides if current call should be logged or not
type Filter = (logger: Logger, message: Message) => boolean;

// a Formatter formats the raw message into a string that will be logged
type Formatter = (logger: Logger, message: Message) => string;

// a Transporter takes the formatted message and "transports" it to console, filesystem, network, etc
type Transporter = (logger: Logger, message: MessageFormatted) => void;

// a Handler bundles Filter, Formatter and Transporter
type Handler = {
  readonly filter: Filter;
  readonly formatter: Formatter;
  readonly transporter: Transporter;
};
type Handlers = Readonly<Handler[]>;

type GetLoggerReturn = { [K in keyof LogLevels]: Log } & {
  getLogger: GetChildLogger;
  logger: Logger;
  handlers: Handlers;
};

type GetLoggerWithChain = (
  name: string,
  handlers: Handlers,
  nameChain: LoggerNameChain,
) => GetLoggerReturn;

// wrapper around GetLoggerWithChain that will be exported
type GetLogger = (args: {
  name?: string;
  handlers: Handlers;
}) => GetLoggerReturn;

type GetChildLogger = (args?: {
  name?: string;
  handlers?: Handlers;
}) => GetLoggerReturn;

export type {
  Filter,
  Formatter,
  GetChildLogger,
  GetLogger,
  GetLoggerReturn,
  GetLoggerWithChain,
  Handler,
  Handlers,
  LogLevels,
  Logger,
  LoggerNameChain,
  Message,
  Transporter,
};
