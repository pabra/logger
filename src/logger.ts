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

const validLoggerNameExp = /[a-zA-Z][a-zA-Z0-9_]*/;
const isValidLoggerName = (name: string) => validLoggerNameExp.test(name);

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

const getLoggerWithChain: GetLoggerWithChain = (
  name,
  level,
  handlers,
  nameChain,
): GetLoggerReturn => {
  if (!isValidLoggerName(name)) {
    throw new Error('invalid name');
  }

  const newNameChain: LoggerNameChain = [...nameChain, name] as const;
  const logger: Logger = {
    name,
    level,
    nameChain: newNameChain,
    chainedName: newNameChain.join(':'),
  } as const;

  const getChildLogger: GetChildLogger = ({
    name: childName = `sub${logger.nameChain.length}`,
    level: childLevel = level,
    handlers: childHandlers = handlers,
  } = {}) =>
    getLoggerWithChain(childName, childLevel, childHandlers, logger.nameChain);

  return {
    getLogger: getChildLogger,
    emerg: msg => logHandlers(logger, { raw: msg, level: 'emerg' }, handlers),
    alert: msg => logHandlers(logger, { raw: msg, level: 'alert' }, handlers),
    crit: msg => logHandlers(logger, { raw: msg, level: 'crit' }, handlers),
    err: msg => logHandlers(logger, { raw: msg, level: 'err' }, handlers),
    warning: msg =>
      logHandlers(logger, { raw: msg, level: 'warning' }, handlers),
    notice: msg => logHandlers(logger, { raw: msg, level: 'notice' }, handlers),
    info: msg => logHandlers(logger, { raw: msg, level: 'info' }, handlers),
    debug: msg => logHandlers(logger, { raw: msg, level: 'debug' }, handlers),
  };
};

const getLogger: GetLogger = ({
  name = 'root',
  level = 'warning',
  handlers,
}): GetLoggerReturn => getLoggerWithChain(name, level, handlers, []);

export { getLogger };
