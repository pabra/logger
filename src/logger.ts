import {
  GetChildLogger,
  GetLogger,
  GetLoggerReturn,
  GetLoggerWithChain,
  Handler,
  Handlers,
  Logger,
  LoggerNameChain,
  Message,
} from './types';

const validLoggerNameExp = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const isValidLoggerName = (name: string) => validLoggerNameExp.test(name);

const log = (logger: Logger, msg: Message, handler: Handler) => {
  if (!handler.filter(logger, msg)) {
    return;
  }

  handler.transporter(logger, {
    ...msg,
    formatted: handler.formatter(logger, msg),
  });
};

const logHandlers = (logger: Logger, msg: Message, handlers: Handlers) => {
  for (const handler of handlers) {
    log(logger, msg, handler);
  }
};

const getLoggerWithChain: GetLoggerWithChain = (
  name,
  handlers,
  nameChain,
): GetLoggerReturn => {
  if (!isValidLoggerName(name)) {
    throw new Error('invalid name');
  }

  const newNameChain: LoggerNameChain = [...nameChain, name] as const;
  const logger: Logger = {
    name,
    nameChain: newNameChain,
  } as const;

  const getChildLogger: GetChildLogger = ({
    name: childName = `child${logger.nameChain.length}`,
    handlers: childHandlers = handlers,
  } = {}) => getLoggerWithChain(childName, childHandlers, logger.nameChain);

  return {
    getLogger: getChildLogger,
    emerg: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'emerg' }, handlers),
    alert: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'alert' }, handlers),
    crit: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'crit' }, handlers),
    err: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'err' }, handlers),
    warning: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'warning' }, handlers),
    notice: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'notice' }, handlers),
    info: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'info' }, handlers),
    debug: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'debug' }, handlers),
  };
};

const getLogger: GetLogger = ({ name = 'root', handlers }): GetLoggerReturn =>
  getLoggerWithChain(name, handlers, []);

export { getLogger };
