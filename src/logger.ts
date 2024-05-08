import { getConsoleRawDataHandler } from './handlers';
import type {
  GetLoggerOverload,
  GetLoggerWithChain,
  Handler,
  Handlers,
  InternalLogger,
  JsonValue,
  Logger,
  LoggerNameChain,
  Message,
} from './types';
import { isHandlers } from './utils';

const validLoggerNameExp = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
const isValidLoggerName = (name: unknown) =>
  typeof name === 'string' && validLoggerNameExp.test(name);

const log = <T extends JsonValue>(
  logger: InternalLogger<T>,
  message: Message,
  handler: Handler<T>,
) => {
  if (handler.filter && !handler.filter(logger, message)) {
    return;
  }

  handler.transporter(logger, message, handler.formatter(logger, message));
};

const logHandlers = <T extends JsonValue>(
  logger: InternalLogger<T>,
  msg: Message,
  handlers: Handlers<T>,
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

  const getChildLogger: GetLoggerOverload = <U extends JsonValue>(
    childName: string,
    maybeHandlerOrHandlers?: Handler<U> | Handlers<U>,
  ) => {
    const childHandlers = isHandlers(maybeHandlerOrHandlers)
      ? maybeHandlerOrHandlers
      : ((maybeHandlerOrHandlers
          ? [maybeHandlerOrHandlers]
          : logger.handlers) as Handlers<U>);

    return getLoggerWithChain(childName, childHandlers, logger.nameChain);
  };

  return {
    getLogger: getChildLogger,
    getHandlers: () => logger.handlers as Handlers<any>,
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

export const getLogger: GetLoggerOverload = <T extends JsonValue>(
  name: string,
  maybeHandlerOrHandlers?: Handler<T> | Handlers<T>,
) => {
  const handlers = isHandlers(maybeHandlerOrHandlers)
    ? maybeHandlerOrHandlers
    : ([maybeHandlerOrHandlers ?? defaultHandler] as Handlers<T>);

  return getLoggerWithChain(name, handlers, []);
};
