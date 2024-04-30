import { logLevels } from '../src';
// eslint-disable-next-line node/no-extraneous-import
import { expect } from '@jest/globals';
import './notest.toBeValidLogLevel';

describe('test utils', () => {
  const exportedLevels = Object.keys(logLevels);
  const goodLevels = [
    'debug',
    'info',
    'notice',
    'warning',
    'err',
    'crit',
    'alert',
    'emerg',
  ];
  const badLevels = [
    undefined,
    null,
    Infinity,
    0,
    1,
    -1,
    new Error('boom'),
    {},
    [],
    NaN,
    '',
    'toString',
    'error',
    'Info',
    'length',
  ];

  test('all good levels', () => {
    const goodLevelsSet = new Set(goodLevels);
    const exportedLevelsSet = new Set(exportedLevels);

    expect(goodLevelsSet.size).toBe(exportedLevelsSet.size);
    expect(
      Array.from(goodLevelsSet).every(level => exportedLevelsSet.has(level)),
    ).toBe(true);
  });

  test('exportedLevels be true', () => {
    exportedLevels.forEach(level => {
      expect(level).toBeValidLogLevel();
    });
  });

  test('goodLevels be true', () => {
    goodLevels.forEach(level => {
      expect(level).toBeValidLogLevel();
    });
  });

  test('badLevels be false', () => {
    badLevels.forEach(level => {
      expect(level).not.toBeValidLogLevel();
    });
  });
});
