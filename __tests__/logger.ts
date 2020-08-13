import getLogger, { Formatter, handlers } from '../src';

const badLoggerNames = [
  '0',
  'root.child',
  '1st',
  '',
  23,
  0,
  true,
  false,
  null,
  undefined,
];
const goodLoggerNames = ['root', 'child', 'undefined'];

describe('root logger names', () => {
  test('valid names', () => {
    goodLoggerNames.forEach(name => {
      expect(() => getLogger(name, [])).not.toThrowError();
    });
  });

  test('invalid names', () => {
    badLoggerNames.forEach((name: any) => {
      expect(() => getLogger(name, [])).toThrowError();
    });
  });
});

describe('child logger names', () => {
  const logger = getLogger('root', []);

  test('valid names', () => {
    goodLoggerNames.forEach(name => {
      expect(() => logger.getLogger(name, [])).not.toThrowError();
    });
  });

  test('invalid names', () => {
    badLoggerNames.forEach((name: any) => {
      expect(() => logger.getLogger(name, [])).toThrowError();
    });
  });
});

describe('handlers', () => {
  test('valid log level names', () => {
    [
      'debug' as const,
      'info' as const,
      'notice' as const,
      'warning' as const,
      'err' as const,
      'crit' as const,
      'alert' as const,
      'emerg' as const,
      undefined,
    ].forEach(name => {
      const handler = handlers.getConsoleRawDataHandler(name);
      expect(handler).toBeTruthy();
    });
  });

  test('invalid log level names', () => {
    ['something', 23, 0, true, false, null].forEach((name: any) => {
      expect(() => handlers.getConsoleRawDataHandler(name)).toThrowError();
    });
  });
});

describe('multiple handlers', () => {
  const logIndicator1 = jest.fn();
  const logIndicator2 = jest.fn();
  const formatter: Formatter = (logger, msg) =>
    `${logger.nameChain.join('+')} ${msg.level}: ${msg.raw}`;
  const logger = getLogger('main', [
    {
      formatter,
      transporter: (_logger, { formatted }) => logIndicator1(formatted),
    },
    {
      formatter,
      transporter: (_logger, { formatted }) => logIndicator2(formatted),
    },
  ]);

  test('both transporters get called', () => {
    logger.warning('my warning');
    expect(logIndicator1).toHaveBeenCalledTimes(1);
    expect(logIndicator1).toHaveBeenCalledWith('main warning: my warning');
    expect(logIndicator2).toHaveBeenCalledTimes(1);
    expect(logIndicator2).toHaveBeenCalledWith('main warning: my warning');
  });
});
