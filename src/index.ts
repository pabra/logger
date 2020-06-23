import {
  Filter,
  Formatter,
  GetLogger,
  GetLoggerReturn,
  GetLoggerWrapper,
  Handler,
  Handlers,
  Logger,
  logLevels,
  Message,
  MessageRaw,
  Transporter,
} from './types';

const maxLevelFilter: Filter = (logger, msg) =>
  logLevels[msg.level] <= logLevels[logger.level];

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

const getLoggerWrapper: GetLoggerWrapper = (
  name = 'root',
  level = 'info',
  handlers = [defaultHandler],
): GetLoggerReturn => getLogger(name, level, handlers, []);

const getLogger: GetLogger = (
  name,
  level,
  handlers,
  nameChain,
): GetLoggerReturn => {
  const logger: Logger = {
    name,
    level,
    nameChain: [...nameChain, name] as const,
  } as const;

  const getChildLogger: GetLoggerWrapper = (
    newName = `sub${logger.nameChain.length}`,
    newLevel,
    newHandlers,
  ) =>
    getLogger(
      newName,
      newLevel ?? level,
      newHandlers ?? handlers,
      logger.nameChain,
    );

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
