import getLogger, { consoleTextHandler } from '../index';

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
    expect(mockLog).toHaveBeenCalledWith('root - emerg: ' + message);
  });

  test('root alert', () => {
    const message = 'this is alert';
    logger.alert(message);
    expect(mockLog).toHaveBeenCalledWith('root - alert: ' + message);
  });

  test('root crit', () => {
    const message = 'this is crit';
    logger.crit(message);
    expect(mockLog).toHaveBeenCalledWith('root - crit: ' + message);
  });

  test('root err', () => {
    const message = 'this is err';
    logger.err(message);
    expect(mockLog).toHaveBeenCalledWith('root - err: ' + message);
  });

  test('root warning', () => {
    const message = 'this is warning';
    logger.warning(message);
    expect(mockLog).toHaveBeenCalledWith('root - warning: ' + message);
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
    expect(mockLog).toHaveBeenCalledWith('root:sub1 - emerg: ' + message);
  });

  test('child alert', () => {
    const message = 'this is alert';
    childLogger.alert(message);
    expect(mockLog).toHaveBeenCalledWith('root:sub1 - alert: ' + message);
  });

  test('child crit', () => {
    const message = 'this is crit';
    childLogger.crit(message);
    expect(mockLog).toHaveBeenCalledWith('root:sub1 - crit: ' + message);
  });

  test('child err', () => {
    const message = 'this is err';
    childLogger.err(message);
    expect(mockLog).toHaveBeenCalledWith('root:sub1 - err: ' + message);
  });

  test('child warning', () => {
    const message = 'this is warning';
    childLogger.warning(message);
    expect(mockLog).toHaveBeenCalledWith('root:sub1 - warning: ' + message);
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

describe('logger names', () => {
  const rootLogger = getLogger({ handlers: [] });

  test('invalid root name', () =>
    expect(() => getLogger({ name: '0', handlers: [] })).toThrowError());

  test('invalid child name', () =>
    expect(() => rootLogger.getLogger({ name: '0' })).toThrowError());
});
