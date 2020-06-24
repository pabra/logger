// https://en.wikipedia.org/wiki/Syslog#Severity_level
const logLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  err: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
} as const;

type LogLevels = typeof logLevels;
type LoggerNameChain = Readonly<string[]>;
type Log = (message: string) => void;
type Logger = {
  readonly name: string;
  readonly nameChain: LoggerNameChain;
  readonly chainedName: string;
};
interface Message {
  readonly raw: string;
  readonly level: keyof LogLevels;
}
interface MessageFormatted extends Message {
  readonly formatted: string;
}

// a Filter decides if current call should be logged or not
type Filter = (logger: Logger, message: Message) => boolean;

// a Formatter formats the raw message into a string that will be logged
type Formatter = (logger: Logger, message: Message) => MessageFormatted;

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

type GetLogger = (args: {
  name?: string;
  handlers: Handlers;
}) => GetLoggerReturn;

type GetChildLogger = (args?: {
  name?: string;
  handlers?: Handlers;
}) => GetLoggerReturn;

export { logLevels };
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
