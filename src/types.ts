import { logLevels } from './levels';

type LogLevels = typeof logLevels;
type LoggerNameChain = Readonly<string[]>;
type Data = Readonly<any>;
type DataArgs = Readonly<Data[]>;
type Log = (message: string, ...args: DataArgs) => void;
type Logger = {
  readonly name: string;
  readonly nameChain: LoggerNameChain;
};
interface Message {
  readonly raw: string;
  readonly data: DataArgs;
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
