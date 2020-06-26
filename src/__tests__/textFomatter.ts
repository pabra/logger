import getLogger, {
  Filter,
  getTextFormatter,
  Handler,
  Transporter,
} from '../index';

describe('text formatter', () => {
  const logIndicator = jest.fn();
  const maxLength = 100;
  const filter: Filter = () => true;
  const transporter: Transporter = (_logger, msg) =>
    logIndicator(msg.formatted);
  const handler: Handler = {
    filter,
    formatter: getTextFormatter(maxLength),
    transporter,
  };
  const handlers = [handler];
  const name = 'loggerName';
  const logger = getLogger({ name, handlers });

  afterEach(() => {
    logIndicator.mockReset();
  });

  test('just message', () => {
    const prefix = 'loggerName WARNING: ';
    const message = 'this is info';
    logger.warning(message);
    expect(logIndicator).toBeCalledWith(prefix + message);
  });

  test('maxLength long message', () => {
    const prefix = 'loggerName WARNING: ';
    const message = new Array(8)
      .fill(null)
      .map((_v, k) => `${String(k + 1).padStart(2, '0')} message`)
      .join('');
    logger.warning(message);
    expect((prefix + message).length).toBe(maxLength);
    expect(logIndicator).toBeCalledWith(prefix + message);
  });

  test('too long message', () => {
    const prefix = 'loggerName WARNING: ';
    const message = new Array(9)
      .fill(null)
      .map((_v, k) => `${String(k + 1).padStart(2, '0')} message`)
      .join('');
    const expectation =
      'loggerName WARNING: 01 message02 message03 message04 message05 message06 message07 message08 mess...';
    logger.warning(message);
    expect((prefix + message).length).toBe(maxLength + 10);
    expect(expectation.length).toBe(maxLength);
    expect(logIndicator).toBeCalledWith(expectation);
  });

  test('message with data', () => {
    const prefix = 'loggerName WARNING: ';
    const message = 'msg';
    logger.warning(message, { a: 1 });
    expect(logIndicator).toBeCalledWith(prefix + message + ' {"a":1}');
  });

  test('message with multiple data', () => {
    const prefix = 'loggerName WARNING: ';
    const message = 'msg';
    logger.warning(message, { a: 1 }, { b: 2 });
    expect(logIndicator).toBeCalledWith(prefix + message + ' {"a":1} {"b":2}');
  });

  test('message with error', () => {
    const prefix = 'loggerName WARNING: ';
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, error);
    expect(logIndicator).toBeCalledWith(
      prefix + message + ' {"name":"Error","message":"boom","stack":"dummy"}',
    );
  });

  test('message with error in object', () => {
    const prefix = 'loggerName WARNING: ';
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
    const prefix = 'loggerName WARNING: ';
    const message = 'msg';
    logger.warning(message, ['a', { b: 2 }, true, Symbol('x')]);
    expect(logIndicator).toBeCalledWith(
      prefix + message + ' ["a",{"b":2},true,null]',
    );
  });

  test('message with too long data', () => {
    const prefix = 'loggerName WARNING: ';
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
});
