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
      expect(() => getLogger(name, [])).not.toThrow();
    });
  });

  test('invalid names', () => {
    badLoggerNames.forEach((name: any) => {
      expect(() => getLogger(name, [])).toThrow();
    });
  });
});

describe('child logger names', () => {
  const logger = getLogger('root', []);

  test('valid names', () => {
    goodLoggerNames.forEach(name => {
      expect(() => logger.getLogger(name, [])).not.toThrow();
    });
  });

  test('invalid names', () => {
    badLoggerNames.forEach((name: any) => {
      expect(() => logger.getLogger(name, [])).toThrow();
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
      expect(() => handlers.getConsoleRawDataHandler(name)).toThrow();
    });
  });
});

const testFormatter: Formatter = (logger, msg) =>
  `${logger.nameChain.join('+')} ${msg.level}: ${msg.messageRaw}${
    msg.data.length ? ` ${msg.data.map(d => String(d)).join(' ')}` : ''
  }`;

describe('multiple handlers', () => {
  const logIndicator1 = jest.fn();
  const logIndicator2 = jest.fn();
  const logger = getLogger('main', [
    {
      formatter: testFormatter,
      transporter: (_logger, { messageFormatted }) =>
        logIndicator1(messageFormatted),
    },
    {
      formatter: testFormatter,
      transporter: (_logger, { messageFormatted }) =>
        logIndicator2(messageFormatted),
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

describe('multiple data', () => {
  const logIndicator = jest.fn();
  const logger = getLogger('main', {
    formatter: testFormatter,
    transporter: (_logger, { messageFormatted }) =>
      logIndicator(messageFormatted),
  });

  afterEach(() => logIndicator.mockReset());

  test('data of same type', () => {
    logger.info('some data', 1, 2, 3);
    expect(logIndicator).toHaveBeenCalledTimes(1);
    expect(logIndicator).toHaveBeenCalledWith('main info: some data 1 2 3');
  });

  test('data of different type', () => {
    logger.info('some data', 1, true, '3');
    expect(logIndicator).toHaveBeenCalledTimes(1);
    expect(logIndicator).toHaveBeenCalledWith('main info: some data 1 true 3');
  });
});
