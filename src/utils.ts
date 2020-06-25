import stringify from 'fast-safe-stringify';

const assertNever = (x: never): never => {
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
const safeStringify = (data: any) => stringify(data, errorReplacer);

export { assertNever, safeStringify };
