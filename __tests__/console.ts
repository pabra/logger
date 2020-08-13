import MockDate from 'mockdate';
import getLogger, { filters, formatters, handlers, transporters } from '../src';

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

  const logger = getLogger('root');

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
    const prefix = `${mockDateIso} [root] NOTICE - `;
    const message = 'this is notice';
    logger.notice(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('root info', () => {
    const prefix = `${mockDateIso} [root] INFORMATIONAL - `;
    const message = 'this is info';
    logger.info(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('root debug', () => {
    const prefix = `${mockDateIso} [root] DEBUG - `;
    const message = 'this is debug';
    logger.debug(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  const childLogger = logger.getLogger('child1');

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
    const prefix = `${mockDateIso} [root.child1] NOTICE - `;
    const message = 'this is notice';
    childLogger.notice(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child info', () => {
    const prefix = `${mockDateIso} [root.child1] INFORMATIONAL - `;
    const message = 'this is info';
    childLogger.info(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child debug', () => {
    const prefix = `${mockDateIso} [root.child1] DEBUG - `;
    const message = 'this is debug';
    childLogger.debug(message);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(prefix + message);
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  // test with data

  const subChildConsoleDataLogger = childLogger.getLogger('subChild', {
    ...handlers.getConsoleRawDataHandler('warning'),
    filter: filters.getMaxLevelFilter('debug'),
  });

  test('child2 debug with data', () => {
    const prefix = `${mockDateIso} [root.child1.subChild] DEBUG - `;
    const message = 'this is debug with data';
    const data = [
      { a: 1 },
      [3, 4, 5],
      new Error('boom'),
      'immutable primitive',
      42,
      false,
      Symbol('23'),
    ];
    subChildConsoleDataLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(prefix + message, ...data);
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  const consoleTextOnlyLogger = logger.getLogger('child1', {
    filter: filters.getMaxLevelFilter('debug'),
    formatter: formatters.textFormatter,
    transporter: transporters.consoleWithoutDataTransporter,
  });

  test('child3 emerg with data', () => {
    const prefix = `${mockDateIso} [root.child1] EMERGENCY - `;
    const message = 'this is emerg with data';
    const data = [42, false];
    consoleTextOnlyLogger.emerg(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
  });

  test('child3 alert with data', () => {
    const prefix = `${mockDateIso} [root.child1] ALERT - `;
    const message = 'this is alert with data';
    const data = [42, false];
    consoleTextOnlyLogger.alert(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
  });

  test('child3 crit with data', () => {
    const prefix = `${mockDateIso} [root.child1] CRITICAL - `;
    const message = 'this is crit with data';
    const data = [42, false];
    consoleTextOnlyLogger.crit(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
  });

  test('child3 err with data', () => {
    const prefix = `${mockDateIso} [root.child1] ERROR - `;
    const message = 'this is err with data';
    const data = [42, false];
    consoleTextOnlyLogger.err(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
  });

  test('child3 warning with data', () => {
    const prefix = `${mockDateIso} [root.child1] WARNING - `;
    const message = 'this is warning with data';
    const data = [42, false];
    consoleTextOnlyLogger.warning(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child3 notice with data', () => {
    const prefix = `${mockDateIso} [root.child1] NOTICE - `;
    const message = 'this is notice with data';
    const data = [42, false];
    consoleTextOnlyLogger.notice(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child3 info with data', () => {
    const prefix = `${mockDateIso} [root.child1] INFORMATIONAL - `;
    const message = 'this is info with data';
    const data = [42, false];
    consoleTextOnlyLogger.info(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('child3 debug with data', () => {
    const prefix = `${mockDateIso} [root.child1] DEBUG - `;
    const message = 'this is debug with data';
    const data = [42, false];
    consoleTextOnlyLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  // console text logger
  test('console text handler', () => {
    const textLogger = logger.getLogger(
      'textChild',
      handlers.getConsoleTextHandler(),
    );
    const prefix = `${mockDateIso} [root.textChild] DEBUG - `;
    const message = 'this is debug with data';
    const data = [42, false];
    textLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(
      prefix + message + ' 42 false',
    );
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('error console text handler', () => {
    const textLogger = logger.getLogger(
      'textChild',
      handlers.getConsoleTextHandler('err'),
    );
    const message = 'this is debug with data';
    const data = [42, false];
    textLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  // console json logger
  test('console json handler', () => {
    const jsonLogger = logger.getLogger(
      'jsonChild',
      handlers.getConsoleJsonHandler(),
    );
    const message = 'this is debug with data';
    const data = [42, false];
    jsonLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).toHaveBeenCalledWith(
      `{"name":"jsonChild","nameChain":["root","jsonChild"],"time":"${mockDateIso}","level":"debug","levelValue":7,"levelServerity":"Debug","message":"${message}","data":[42,false]}`,
    );
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });

  test('info console json handler', () => {
    const jsonLogger = logger.getLogger(
      'jsonChild',
      handlers.getConsoleJsonHandler('info'),
    );
    const message = 'this is debug with data';
    const data = [42, false];
    jsonLogger.debug(message, ...data);
    expect(logIndicatorLog).not.toHaveBeenCalled();
    expect(logIndicatorDebug).not.toHaveBeenCalled();
    expect(logIndicatorInfo).not.toHaveBeenCalled();
    expect(logIndicatorWarn).not.toHaveBeenCalled();
    expect(logIndicatorError).not.toHaveBeenCalled();
  });
});
