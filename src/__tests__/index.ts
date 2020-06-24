import getLogger, {
  consoleTextHandler,
  Formatter,
  getMaxLevelFilter,
  Transporter,
} from '../index';

const originalConsoleLog = console.log;
afterAll(() => (console.log = originalConsoleLog));

describe('tests involving console.log', () => {
  const mockLog = jest.fn();
  console.log = mockLog;
  const logger = getLogger({ handlers: [consoleTextHandler] });
  afterEach(() => mockLog.mockReset());

  test('root emerg', () => {
    const message = 'this is emergency';
    logger.emerg(message);
    expect(mockLog).toHaveBeenCalledWith('root EMERGENCY: ' + message);
  });

  test('root alert', () => {
    const message = 'this is alert';
    logger.alert(message);
    expect(mockLog).toHaveBeenCalledWith('root ALERT: ' + message);
  });

  test('root crit', () => {
    const message = 'this is crit';
    logger.crit(message);
    expect(mockLog).toHaveBeenCalledWith('root CRITICAL: ' + message);
  });

  test('root err', () => {
    const message = 'this is err';
    logger.err(message);
    expect(mockLog).toHaveBeenCalledWith('root ERROR: ' + message);
  });

  test('root warning', () => {
    const message = 'this is warning';
    logger.warning(message);
    expect(mockLog).toHaveBeenCalledWith('root WARNING: ' + message);
  });

  test('root notice', () => {
    const message = 'this is notice';
    logger.notice(message);
    expect(mockLog).not.toHaveBeenCalled();
  });

  test('root info', () => {
    const message = 'this is info';
    logger.info(message);
    expect(mockLog).not.toHaveBeenCalled();
  });

  test('root debug', () => {
    const message = 'this is debug';
    logger.debug(message);
    expect(mockLog).not.toHaveBeenCalled();
  });

  const childLogger = logger.getLogger();

  test('child emerg', () => {
    const message = 'this is emergency';
    childLogger.emerg(message);
    expect(mockLog).toHaveBeenCalledWith('root.child1 EMERGENCY: ' + message);
  });

  test('child alert', () => {
    const message = 'this is alert';
    childLogger.alert(message);
    expect(mockLog).toHaveBeenCalledWith('root.child1 ALERT: ' + message);
  });

  test('child crit', () => {
    const message = 'this is crit';
    childLogger.crit(message);
    expect(mockLog).toHaveBeenCalledWith('root.child1 CRITICAL: ' + message);
  });

  test('child err', () => {
    const message = 'this is err';
    childLogger.err(message);
    expect(mockLog).toHaveBeenCalledWith('root.child1 ERROR: ' + message);
  });

  test('child warning', () => {
    const message = 'this is warning';
    childLogger.warning(message);
    expect(mockLog).toHaveBeenCalledWith('root.child1 WARNING: ' + message);
  });

  test('child notice', () => {
    const message = 'this is notice';
    childLogger.notice(message);
    expect(mockLog).not.toHaveBeenCalled();
  });

  test('child info', () => {
    const message = 'this is info';
    childLogger.info(message);
    expect(mockLog).not.toHaveBeenCalled();
  });

  test('child debug', () => {
    const message = 'this is debug';
    childLogger.debug(message);
    expect(mockLog).not.toHaveBeenCalled();
  });
});

describe('childlogger with higher levels', () => {
  const logIndicator = jest.fn();
  const formatter: Formatter = (logger, msg) =>
    `${logger.nameChain.join('+')} ${msg.level}: ${msg.raw}`;
  const transporter: Transporter = (_logger, { formatted }) =>
    logIndicator(formatted);
  const rootLogger = getLogger({
    name: 'main',
    handlers: [
      {
        filter: getMaxLevelFilter('err'),
        formatter,
        transporter,
      },
    ],
  });

  afterEach(() => logIndicator.mockReset());

  test('main emerg', () => {
    const message = 'this is emerg';
    rootLogger.emerg(message);
    expect(logIndicator).toHaveBeenCalledWith('main emerg: ' + message);
  });

  test('main alert', () => {
    const message = 'this is alert';
    rootLogger.alert(message);
    expect(logIndicator).toHaveBeenCalledWith('main alert: ' + message);
  });

  test('main crit', () => {
    const message = 'this is crit';
    rootLogger.crit(message);
    expect(logIndicator).toHaveBeenCalledWith('main crit: ' + message);
  });

  test('main err', () => {
    const message = 'this is err';
    rootLogger.err(message);
    expect(logIndicator).toHaveBeenCalledWith('main err: ' + message);
  });

  test('main warning', () => {
    const message = 'this is warning';
    rootLogger.warning(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('main notice', () => {
    const message = 'this is notice';
    rootLogger.notice(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('main info', () => {
    const message = 'this is info';
    rootLogger.info(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('main debug', () => {
    const message = 'this is debug';
    rootLogger.debug(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  const childLogger = rootLogger.getLogger({
    name: 'subLog',
    handlers: [
      {
        filter: getMaxLevelFilter('notice'),
        formatter,
        transporter,
      },
    ],
  });

  test('child emerg', () => {
    const message = 'this is emerg';
    childLogger.emerg(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog emerg: ' + message);
  });

  test('child alert', () => {
    const message = 'this is alert';
    childLogger.alert(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog alert: ' + message);
  });

  test('child crit', () => {
    const message = 'this is crit';
    childLogger.crit(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog crit: ' + message);
  });

  test('child err', () => {
    const message = 'this is err';
    childLogger.err(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog err: ' + message);
  });

  test('child warning', () => {
    const message = 'this is warning';
    childLogger.warning(message);
    expect(logIndicator).toHaveBeenCalledWith(
      'main+subLog warning: ' + message,
    );
  });

  test('child notice', () => {
    const message = 'this is notice';
    childLogger.notice(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog notice: ' + message);
  });

  test('child info', () => {
    const message = 'this is info';
    childLogger.info(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child debug', () => {
    const message = 'this is debug';
    childLogger.debug(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });
});

describe('childlogger with lower levels', () => {
  const logIndicator = jest.fn();
  const formatter: Formatter = (logger, msg) =>
    `${logger.nameChain.join('+')} ${msg.level}: ${msg.raw}`;
  const transporter: Transporter = (_logger, { formatted }) =>
    logIndicator(formatted);
  const rootLogger = getLogger({
    name: 'main',
    handlers: [
      {
        filter: getMaxLevelFilter('info'),
        formatter,
        transporter,
      },
    ],
  });

  afterEach(() => logIndicator.mockReset());

  test('main emerg', () => {
    const message = 'this is emerg';
    rootLogger.emerg(message);
    expect(logIndicator).toHaveBeenCalledWith('main emerg: ' + message);
  });

  test('main alert', () => {
    const message = 'this is alert';
    rootLogger.alert(message);
    expect(logIndicator).toHaveBeenCalledWith('main alert: ' + message);
  });

  test('main crit', () => {
    const message = 'this is crit';
    rootLogger.crit(message);
    expect(logIndicator).toHaveBeenCalledWith('main crit: ' + message);
  });

  test('main err', () => {
    const message = 'this is err';
    rootLogger.err(message);
    expect(logIndicator).toHaveBeenCalledWith('main err: ' + message);
  });

  test('main warning', () => {
    const message = 'this is warning';
    rootLogger.warning(message);
    expect(logIndicator).toHaveBeenCalledWith('main warning: ' + message);
  });

  test('main notice', () => {
    const message = 'this is notice';
    rootLogger.notice(message);
    expect(logIndicator).toHaveBeenCalledWith('main notice: ' + message);
  });

  test('main info', () => {
    const message = 'this is info';
    rootLogger.info(message);
    expect(logIndicator).toHaveBeenCalledWith('main info: ' + message);
  });

  test('main debug', () => {
    const message = 'this is debug';
    rootLogger.debug(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  const childLogger = rootLogger.getLogger({
    name: 'subLog',
    handlers: [
      {
        filter: getMaxLevelFilter('crit'),
        formatter,
        transporter,
      },
    ],
  });

  test('child emerg', () => {
    const message = 'this is emerg';
    childLogger.emerg(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog emerg: ' + message);
  });

  test('child alert', () => {
    const message = 'this is alert';
    childLogger.alert(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog alert: ' + message);
  });

  test('child crit', () => {
    const message = 'this is crit';
    childLogger.crit(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog crit: ' + message);
  });

  test('child err', () => {
    const message = 'this is err';
    childLogger.err(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child warning', () => {
    const message = 'this is warning';
    childLogger.warning(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child notice', () => {
    const message = 'this is notice';
    childLogger.notice(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child info', () => {
    const message = 'this is info';
    childLogger.info(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child debug', () => {
    const message = 'this is debug';
    childLogger.debug(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });
});

describe('logger names', () => {
  const rootLogger = getLogger({ handlers: [] });

  test('invalid root name', () =>
    expect(() => getLogger({ name: '0', handlers: [] })).toThrowError());

  test('invalid child name', () =>
    expect(() => rootLogger.getLogger({ name: 'root.child1' })).toThrowError());
});
