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

const validLoggerNameExp = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
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
    throw new Error(
      `invalid name: '${name}' - must match regex '${validLoggerNameExp.source}'`,
    );
  }

  const newNameChain: LoggerNameChain = [...nameChain, name] as const;
  const logger = {
    name,
    nameChain: newNameChain,
    handlers,
  };

  const getChildLogger: GetChildLogger = ({
    name: childName = `child${logger.nameChain.length}`,
    handlers: childHandlers = logger.handlers,
  } = {}) => getLoggerWithChain(childName, childHandlers, logger.nameChain);

  return {
    getLogger: getChildLogger,
    getHandlers: () => logger.handlers,
    addHandler: (...newHandlers) => {
      logger.handlers = [...logger.handlers, ...newHandlers];
      logHandlers(
        logger,
        {
          raw: `added ${newHandlers.length} new handlers (${logger.handlers.length} handlers in total now)`,
          data: [],
          level: 'debug',
        },
        logger.handlers,
      );
    },
    setHandler: (...newHandlers) => {
      logger.handlers = newHandlers;
      logHandlers(
        logger,
        {
          raw: `set ${newHandlers.length} new handlers`,
          data: [],
          level: 'debug',
        },
        logger.handlers,
      );
    },
    emerg: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'emerg' }, logger.handlers),
    alert: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'alert' }, logger.handlers),
    crit: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'crit' }, logger.handlers),
    err: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'err' }, logger.handlers),
    warning: (msg, ...data) =>
      logHandlers(
        logger,
        { raw: msg, data, level: 'warning' },
        logger.handlers,
      ),
    notice: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'notice' }, logger.handlers),
    info: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'info' }, logger.handlers),
    debug: (msg, ...data) =>
      logHandlers(logger, { raw: msg, data, level: 'debug' }, logger.handlers),
  };
};

const getLogger: GetLogger = ({ name = 'root', handlers }): GetLoggerReturn =>
  getLoggerWithChain(name, handlers, []);

export { getLogger };
