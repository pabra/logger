import getLogger, {
  consoleTextWithoutDataHandler,
  getMaxLevelFilter,
} from '../index';

describe('tests involving console.log', () => {
  const originalConsoleLog = console.log;
  const originalConsoleDebug = console.debug;
  const originalConsoleInfo = console.info;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  const logIndicatorLog = jest.fn();
  const logIndicatorDebug = jest.fn();
  const logIndicatorInfo = jest.fn();
  const logIndicatorWarn = jest.fn();
  const logIndicatorError = jest.fn();

  console.log = logIndicatorLog;
  console.debug = logIndicatorDebug;
  console.info = logIndicatorInfo;
  console.warn = logIndicatorWarn;
  console.error = logIndicatorError;

  const logger = getLogger({ handlers: [consoleTextWithoutDataHandler] });

  afterEach(() => {
    logIndicatorLog.mockReset();
    logIndicatorDebug.mockReset();
    logIndicatorInfo.mockReset();
    logIndicatorWarn.mockReset();
    logIndicatorError.mockReset();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.debug = originalConsoleDebug;
    console.info = originalConsoleInfo;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  });

  test('root emerg', () => {
    const message = 'this is emergency';
    logger.emerg(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root EMERGENCY: ' + message,
    );
  });

  test('root alert', () => {
    const message = 'this is alert';
    logger.alert(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith('root ALERT: ' + message);
  });

  test('root crit', () => {
    const message = 'this is crit';
    logger.crit(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith('root CRITICAL: ' + message);
  });

  test('root err', () => {
    const message = 'this is err';
    logger.err(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith('root ERROR: ' + message);
  });

  test('root warning', () => {
    const message = 'this is warning';
    logger.warning(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).toHaveBeenCalledWith('root WARNING: ' + message);
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('root notice', () => {
    const message = 'this is notice';
    logger.notice(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('root info', () => {
    const message = 'this is info';
    logger.info(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('root debug', () => {
    const message = 'this is debug';
    logger.debug(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  const childLogger = logger.getLogger();

  test('child emerg', () => {
    const message = 'this is emergency';
    childLogger.emerg(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1 EMERGENCY: ' + message,
    );
  });

  test('child alert', () => {
    const message = 'this is alert';
    childLogger.alert(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1 ALERT: ' + message,
    );
  });

  test('child crit', () => {
    const message = 'this is crit';
    childLogger.crit(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1 CRITICAL: ' + message,
    );
  });

  test('child err', () => {
    const message = 'this is err';
    childLogger.err(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1 ERROR: ' + message,
    );
  });

  test('child warning', () => {
    const message = 'this is warning';
    childLogger.warning(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).toHaveBeenCalledWith(
      'root.child1 WARNING: ' + message,
    );
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child notice', () => {
    const message = 'this is notice';
    childLogger.notice(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child info', () => {
    const message = 'this is info';
    childLogger.info(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child debug', () => {
    const message = 'this is debug';
    childLogger.debug(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  const consoleAllChildLogger = childLogger.getLogger({
    handlers: [
      { ...consoleTextWithoutDataHandler, filter: getMaxLevelFilter('debug') },
    ],
  });

  test('child2 emerg', () => {
    const message = 'this is emergency';
    consoleAllChildLogger.emerg(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1.child2 EMERGENCY: ' + message,
    );
  });

  test('child2 alert', () => {
    const message = 'this is alert';
    consoleAllChildLogger.alert(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1.child2 ALERT: ' + message,
    );
  });

  test('child2 crit', () => {
    const message = 'this is crit';
    consoleAllChildLogger.crit(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1.child2 CRITICAL: ' + message,
    );
  });

  test('child2 err', () => {
    const message = 'this is err';
    consoleAllChildLogger.err(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      'root.child1.child2 ERROR: ' + message,
    );
  });

  test('child2 warning', () => {
    const message = 'this is warning';
    consoleAllChildLogger.warning(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).toHaveBeenCalledWith(
      'root.child1.child2 WARNING: ' + message,
    );
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child2 notice', () => {
    const message = 'this is notice';
    consoleAllChildLogger.notice(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(
      'root.child1.child2 NOTICE: ' + message,
    );
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child2 info', () => {
    const message = 'this is info';
    consoleAllChildLogger.info(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(
      'root.child1.child2 INFORMATIONAL: ' + message,
    );
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child2 debug', () => {
    const message = 'this is debug';
    consoleAllChildLogger.debug(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(
      'root.child1.child2 DEBUG: ' + message,
    );
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  // test with data

  test('child2 debug with data', () => {
    const message = 'this is debug with data';
    const data = [{ a: 1 }, [3, 4, 5], new Error('boom')];
    consoleAllChildLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(
      'root.child1.child2 DEBUG: ' + message,
      data[0],
      data[1],
      data[2],
    );
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });
});
