import stringify from 'fast-safe-stringify';
import type { Handler, Handlers, LogLevelName } from './types';

export const assertNever = (x: never): never => {
  throw new Error('Unexpected object: ' + x);
};

const errorReplacer = (_key: string, value: any) =>
  value instanceof Error
    ? {
        name: value.name,
        message: value.message,
        stack: value.stack,
        code: (value as any).code,
      }
    : value;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const safeStringify = (data: any) => stringify(data, errorReplacer);

export const isLogLevelName = (name: unknown): name is LogLevelName =>
  typeof name === 'string' &&
  (name === 'emerg' ||
    name === 'alert' ||
    name === 'crit' ||
    name === 'err' ||
    name === 'warning' ||
    name === 'notice' ||
    name === 'info' ||
    name === 'debug');

export const isHandlers = (
  handlerOrHandlers: Handler | Handlers | undefined,
): handlerOrHandlers is Handlers => Array.isArray(handlerOrHandlers);
