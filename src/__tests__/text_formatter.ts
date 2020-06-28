import MockDate from 'mockdate';
import getLogger, {
  Filter,
  getTextFormatter,
  Handler,
  Transporter,
} from '../index';

describe('text formatter', () => {
  const mockDate = new Date();
  const mockDateIso = mockDate.toISOString();
  MockDate.set(mockDate);
  const logIndicator = jest.fn();
  const maxLength = 123;
  const filter: Filter = () => true;
  const transporter: Transporter = (_logger, msg) =>
    logIndicator(msg.formatted);
  const handler: Handler = {
    filter,
    formatter: getTextFormatter(maxLength),
    transporter,
  };
  const handlers = [handler];
  const name = 'myApp';
  const logger = getLogger({ name, handlers });

  afterEach(() => {
    logIndicator.mockReset();
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('get handlers', () => {
    expect(logger.getHandlers()).toBe(handlers);
  });

  test('just message', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'this is warning';
    logger.warning(message);
    expect(logIndicator).toBeCalledWith(prefix + message);
  });

  test('maxLength long message', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = new Array(8)
      .fill(null)
      .map((_v, k) => `${String(k + 1).padStart(2, '0')}message+`)
      .join('');
    logger.warning(message);
    expect((prefix + message).length).toBe(maxLength);
    expect(logIndicator).toBeCalledWith(prefix + message);
  });

  test('too long message', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = new Array(9)
      .fill(null)
      .map((_v, k) => `${String(k + 1).padStart(2, '0')}message+`)
      .join('');
    const expectation =
      prefix +
      '01message+02message+03message+04message+05message+06message+07message+08messa...';
    logger.warning(message);
    expect((prefix + message).length).toBe(maxLength + 10);
    expect(expectation.length).toBe(maxLength);
    expect(logIndicator).toBeCalledWith(expectation);
  });

  test('message with data', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    logger.warning(message, { a: 1 });
    expect(logIndicator).toBeCalledWith(prefix + message + ' {"a":1}');
  });

  test('message with multiple data', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    logger.warning(message, { a: 1 }, { b: 2 });
    expect(logIndicator).toBeCalledWith(prefix + message + ' {"a":1} {"b":2}');
  });

  test('message with error', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, error);
    expect(logIndicator).toBeCalledWith(
      prefix + message + ' {"name":"Error","message":"boom","stack":"dummy"}',
    );
  });

  test('message with error in object', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, { error });
    expect(logIndicator).toBeCalledWith(
      prefix +
        message +
        ' {"error":{"name":"Error","message":"boom","stack":"dummy"}}',
    );
  });

  test('message with complex data', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    logger.warning(message, ['a', { b: 2 }, true, Symbol('x')]);
    expect(logIndicator).toBeCalledWith(
      prefix + message + ' ["a",{"b":2},true,null]',
    );
  });

  test('message with too long data', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    logger.warning(
      message,
      new Array(10).fill(null).map(() => '0123456789'),
    );
    expect(logIndicator).toBeCalledWith(
      prefix +
        message +
        ' ["0123456789","0123456789","0123456789","0123456789","0123456789","012345...',
    );
  });

  test('child logger with same handlers', () => {
    const childLogger = logger.getLogger({ name: 'child-1' });
    const prefix = `${mockDateIso} [myApp.child-1] WARNING - `;
    const message = 'this is warning 1';
    childLogger.warning(message);
    expect(logIndicator).toBeCalledWith(prefix + message);
  });

  test('another child logger with later exchanged handlers', () => {
    const childLogger = logger.getLogger({ name: 'child-2' });
    childLogger.setHandler({
      ...childLogger.getHandlers()[0],
      formatter: (loggerMeta, msg) =>
        `[${loggerMeta.nameChain.join('/')}] msg: ${msg.raw}`,
    });
    const prefix = '[myApp/child-2] msg: ';
    const message = 'this is warning 2';
    childLogger.warning(message);
    expect(logIndicator).toBeCalledWith(prefix + message);
  });

  test('another child logger with later added handler', () => {
    const childLogger = logger.getLogger({ name: 'child-3' });
    childLogger.addHandler({
      ...childLogger.getHandlers()[0],
      formatter: (loggerMeta, msg) =>
        `[${loggerMeta.nameChain.join('/')}] msg: ${msg.raw}`,
    });
    const prefix1Warn = `${mockDateIso} [myApp.child-3] WARNING - `;
    const prefix1Debug = `${mockDateIso} [myApp.child-3] DEBUG - `;
    const prefix2 = '[myApp/child-3] msg: ';
    const messageHandlerAdded =
      'added 1 new handlers (2 handlers in total now)';
    const message = 'this is warning 3';
    childLogger.warning(message);
    expect(logIndicator).toBeCalledWith(prefix1Debug + messageHandlerAdded);
    expect(logIndicator).toBeCalledWith(prefix2 + messageHandlerAdded);
    expect(logIndicator).toBeCalledWith(prefix1Warn + message);
    expect(logIndicator).toBeCalledWith(prefix2 + message);
  });
});
