import stringify from 'fast-safe-stringify';
import type { Handler, Handlers, JsonValue, LogLevelName } from './types';

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

type Replacer = (key: string, value: any) => any;

function getErrorReplacer(
  replacer?: Replacer | Replacer[],
): (key: string, value: any) => any {
  if (replacer === undefined) {
    return errorReplacer;
  }

  if (Array.isArray(replacer)) {
    return (key, value) =>
      [...replacer, errorReplacer].reduce((acc, fn) => fn(key, acc), value);
  }

  return (key, value) =>
    [replacer, errorReplacer].reduce((acc, fn) => fn(key, acc), value);
}

export function getSafeStringifyWithErrorReplacer(
  replacer?: Replacer | Replacer[],
): (data: any) => string {
  const withErrorReplacer = getErrorReplacer(replacer);

  return (data: any) => stringify(data, withErrorReplacer);
}

export const safeStringify = getSafeStringifyWithErrorReplacer();

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

export const isHandlers = <T extends JsonValue>(
  handlerOrHandlers: Handler<T> | Handlers<T> | undefined,
): handlerOrHandlers is Handlers<T> => Array.isArray(handlerOrHandlers);

export const oneMiB = Math.pow(1024, 2);

// FIXME: do not just cut off stringified JSON (won't be parsable anymore)
export const limitLength = (text: string, length: number): string =>
  text.length > length ? text.slice(0, length - 3) + '...' : text;
