import { getConsoleRawDataHandler } from './handlers';
import type {
  GetLoggerOverload,
  GetLoggerWithChain,
  Handler,
  Handlers,
  InternalLogger,
  Logger,
  LoggerNameChain,
  Message,
} from './types';
import { isHandlers } from './utils';

const validLoggerNameExp = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const isValidLoggerName = (name: unknown) =>
  typeof name === 'string' && validLoggerNameExp.test(name);

const log = (logger: InternalLogger, msg: Message, handler: Handler) => {
  if (handler.filter && !handler.filter(logger, msg)) {
    return;
  }

  handler.transporter(logger, {
    ...msg,
    messageFormatted: handler.formatter(logger, msg),
  });
};

const logHandlers = (
  logger: InternalLogger,
  msg: Message,
  handlers: Handlers,
) => {
  for (const handler of handlers) {
    log(logger, msg, handler);
  }
};

const getLoggerWithChain: GetLoggerWithChain = (
  name,
  handlers,
  nameChain,
): Logger => {
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
  } as const;

  const getChildLogger: GetLoggerOverload = (
    childName: string,
    maybeHandlerOrHandlers?: Handler | Handlers,
  ) => {
    const childHandlers = isHandlers(maybeHandlerOrHandlers)
      ? maybeHandlerOrHandlers
      : maybeHandlerOrHandlers
        ? [maybeHandlerOrHandlers]
        : logger.handlers;

    return getLoggerWithChain(childName, childHandlers, logger.nameChain);
  };

  return {
    getLogger: getChildLogger,
    getHandlers: () => logger.handlers,
    emerg: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'emerg' },
        logger.handlers,
      ),
    alert: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'alert' },
        logger.handlers,
      ),
    crit: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'crit' },
        logger.handlers,
      ),
    err: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'err' },
        logger.handlers,
      ),
    warning: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'warning' },
        logger.handlers,
      ),
    notice: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'notice' },
        logger.handlers,
      ),
    info: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'info' },
        logger.handlers,
      ),
    debug: (msg, ...data) =>
      logHandlers(
        logger,
        { messageRaw: msg, data, level: 'debug' },
        logger.handlers,
      ),
  };
};

const defaultHandler = getConsoleRawDataHandler();

export const getLogger: GetLoggerOverload = (
  name: string,
  maybeHandlerOrHandlers?: Handler | Handlers,
) => {
  const handlers = isHandlers(maybeHandlerOrHandlers)
    ? maybeHandlerOrHandlers
    : [maybeHandlerOrHandlers ?? defaultHandler];

  return getLoggerWithChain(name, handlers, []);
};
