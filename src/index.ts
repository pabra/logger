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
type LoggerName = string;
type NameChain = Readonly<LoggerName[]>;
type Logger = {
  readonly level: keyof LogLevels;
  readonly name: LoggerName;
  readonly nameChain: NameChain;
};
type MessageRaw = string;
interface Message {
  readonly raw: MessageRaw;
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

const maxLevelFilter: Filter = (logger, msg) => msg.level <= logger.level;

const textFormatter: Formatter = (logger, msg) => ({
  ...msg,
  formatted: `${logger.name}: ${msg.raw}`,
});

const consoleTransporter: Transporter = (_logger, msg) => {
  console.log(msg.formatted);
};

const defaultHandler: Handler = {
  filter: maxLevelFilter,
  formatter: textFormatter,
  transporter: consoleTransporter,
};

const log = (logger: Logger, msg: Message, handler: Handler) => {
  if (!handler.filter(logger, msg)) {
    return;
  }

  handler.transporter(logger, handler.formatter(logger, msg));
};

const logHandlers = (logger: Logger, msg: Message, handlers: Handlers) => {
  for (const handler of handlers) {
    log(logger, msg, handler);
  }
};

type GetLoggerArgs = {
  readonly name: string;
  readonly level: keyof LogLevels;
  readonly handlers: Handlers;
  readonly nameChain: NameChain;
};
type GetLoggerReturn = { [K in keyof LogLevels]: (msg: MessageRaw) => void } & {
  getLogger: GetLoggerWrapper;
};
type GetLogger = (args: GetLoggerArgs) => GetLoggerReturn;
type GetLoggerWrapperArgs = {
  readonly name: string;
  readonly level?: keyof LogLevels;
  readonly handlers?: Handlers;
};
type GetLoggerWrapper = (args: GetLoggerWrapperArgs) => GetLoggerReturn;

const getLoggerWrapper: GetLoggerWrapper = ({
  name = 'root',
  level = 'info',
  handlers = [defaultHandler],
}): GetLoggerReturn => getLogger({ name, level, handlers, nameChain: [] });

const getLogger: GetLogger = ({
  name,
  level,
  handlers,
  nameChain,
}): GetLoggerReturn => {
  const logger: Logger = {
    name,
    level,
    nameChain: [...nameChain, name] as const,
  } as const;
  const getChildLogger: GetLoggerWrapper = ({
    name: newName,
    level: newLevel,
    handlers: newHandlers,
  }) =>
    getLogger({
      name: newName,
      level: newLevel ?? level,
      handlers: newHandlers ?? handlers,
      nameChain: logger.nameChain,
    });

  return {
    getLogger: getChildLogger,
    emerg: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'emerg' }, handlers),
    alert: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'alert' }, handlers),
    crit: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'crit' }, handlers),
    err: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'err' }, handlers),
    warning: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'warning' }, handlers),
    notice: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'notice' }, handlers),
    info: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'info' }, handlers),
    debug: (msg: MessageRaw) =>
      logHandlers(logger, { raw: msg, level: 'debug' }, handlers),
  };
};

export default getLoggerWrapper;
