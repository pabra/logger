// eslint-disable-next-line node/no-extraneous-import
import { expect } from '@jest/globals';
// eslint-disable-next-line node/no-extraneous-import
import type { MatcherFunction } from 'expect';
import { utils } from '../src';

const toBeValidLogLevel: MatcherFunction = value =>
  utils.isLogLevelName(value)
    ? {
        message:
          /* istanbul ignore next */
          () => `'${value}' is valid log level`,
        pass: true,
      }
    : {
        message:
          /* istanbul ignore next */
          () => `'${value}' is not valid log level`,
        pass: false,
      };

expect.extend({ toBeValidLogLevel });

declare module 'expect' {
  interface AsymmetricMatchers {
    toBeValidLogLevel(): void;
  }
  interface Matchers<R> {
    toBeValidLogLevel(): R;
  }
}
