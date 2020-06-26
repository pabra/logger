import MockDate from 'mockdate';
import getLogger, {
  consoleTextWithoutDataHandler,
  getMaxLevelFilter,
} from '../index';

describe('tests involving console.log', () => {
  const mockDate = new Date();
  const mockDateIso = mockDate.toISOString();
  MockDate.set(mockDate);

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
    MockDate.reset();
  });

  test('root emerg', () => {
    const prefix = `${mockDateIso} [root] EMERGENCY - `;
    const message = 'this is emergency';
    logger.emerg(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('root alert', () => {
    const prefix = `${mockDateIso} [root] ALERT - `;
    const message = 'this is alert';
    logger.alert(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('root crit', () => {
    const prefix = `${mockDateIso} [root] CRITICAL - `;
    const message = 'this is crit';
    logger.crit(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('root err', () => {
    const prefix = `${mockDateIso} [root] ERROR - `;
    const message = 'this is err';
    logger.err(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('root warning', () => {
    const prefix = `${mockDateIso} [root] WARNING - `;
    const message = 'this is warning';
    logger.warning(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).toHaveBeenCalledWith(prefix + message);
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
    const prefix = `${mockDateIso} [root.child1] EMERGENCY - `;
    const message = 'this is emergency';
    childLogger.emerg(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child alert', () => {
    const prefix = `${mockDateIso} [root.child1] ALERT - `;
    const message = 'this is alert';
    childLogger.alert(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child crit', () => {
    const prefix = `${mockDateIso} [root.child1] CRITICAL - `;
    const message = 'this is crit';
    childLogger.crit(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child err', () => {
    const prefix = `${mockDateIso} [root.child1] ERROR - `;
    const message = 'this is err';
    childLogger.err(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child warning', () => {
    const prefix = `${mockDateIso} [root.child1] WARNING - `;
    const message = 'this is warning';
    childLogger.warning(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).toHaveBeenCalledWith(prefix + message);
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
    const prefix = `${mockDateIso} [root.child1.child2] EMERGENCY - `;
    const message = 'this is emergency';
    consoleAllChildLogger.emerg(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child2 alert', () => {
    const prefix = `${mockDateIso} [root.child1.child2] ALERT - `;
    const message = 'this is alert';
    consoleAllChildLogger.alert(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child2 crit', () => {
    const prefix = `${mockDateIso} [root.child1.child2] CRITICAL - `;
    const message = 'this is crit';
    consoleAllChildLogger.crit(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child2 err', () => {
    const prefix = `${mockDateIso} [root.child1.child2] ERROR - `;
    const message = 'this is err';
    consoleAllChildLogger.err(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(prefix + message);
  });

  test('child2 warning', () => {
    const prefix = `${mockDateIso} [root.child1.child2] WARNING - `;
    const message = 'this is warning';
    consoleAllChildLogger.warning(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child2 notice', () => {
    const prefix = `${mockDateIso} [root.child1.child2] NOTICE - `;
    const message = 'this is notice';
    consoleAllChildLogger.notice(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child2 info', () => {
    const prefix = `${mockDateIso} [root.child1.child2] INFORMATIONAL - `;
    const message = 'this is info';
    consoleAllChildLogger.info(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child2 debug', () => {
    const prefix = `${mockDateIso} [root.child1.child2] DEBUG - `;
    const message = 'this is debug';
    consoleAllChildLogger.debug(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  // test with data

  test('child2 debug with data', () => {
    const prefix = `${mockDateIso} [root.child1.child2] DEBUG - `;
    const message = 'this is debug with data';
    const data = [{ a: 1 }, [3, 4, 5], new Error('boom')];
    consoleAllChildLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(
      prefix + message,
      data[0],
      data[1],
      data[2],
    );
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });
});
