import MockDate from 'mockdate';
import type { Filter, Handler, Transporter } from '../src';
import getLogger, { formatters } from '../src';

describe('text formatter', () => {
  const mockDate = new Date();
  const mockDateIso = mockDate.toISOString();
  MockDate.set(mockDate);
  const logIndicator = jest.fn();
  const maxLength = 123;
  const filter: Filter = () => true;
  const transporter: Transporter<string> = (
    _logger,
    _message,
    messageFormatted,
  ) => logIndicator(messageFormatted);
  const handler: Handler<string> = {
    filter,
    formatter: formatters.getTextLengthFormatter(maxLength),
    transporter,
  };
  const handlers = [handler];
  const name = 'myApp';
  const logger = getLogger(name, handlers);

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
    expect(logIndicator).toHaveBeenCalledWith(prefix + message);
  });

  test('maxLength long message', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = new Array(8)
      .fill(null)
      .map((_v, k) => `${String(k + 1).padStart(2, '0')}message+`)
      .join('');
    logger.warning(message);
    expect((prefix + message).length).toBe(maxLength);
    expect(logIndicator).toHaveBeenCalledWith(prefix + message);
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
    expect(logIndicator).toHaveBeenCalledWith(expectation);
  });

  test('message with data', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    logger.warning(message, { a: 1 });
    expect(logIndicator).toHaveBeenCalledWith(prefix + message + ' {"a":1}');
  });

  test('message with multiple data', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    logger.warning(message, { a: 1 }, { b: 2 });
    expect(logIndicator).toHaveBeenCalledWith(
      prefix + message + ' {"a":1} {"b":2}',
    );
  });

  test('message with error', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, error);
    expect(logIndicator).toHaveBeenCalledWith(
      prefix + message + ' {"name":"Error","message":"boom","stack":"dummy"}',
    );
  });

  test('message with error in object', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, { error });
    expect(logIndicator).toHaveBeenCalledWith(
      prefix +
        message +
        ' {"error":{"name":"Error","message":"boom","stack":"dummy"}}',
    );
  });

  test('message with complex data', () => {
    const prefix = `${mockDateIso} [myApp] WARNING - `;
    const message = 'msg';
    logger.warning(message, ['a', { b: 2 }, true, Symbol('x')]);
    expect(logIndicator).toHaveBeenCalledWith(
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
    expect(logIndicator).toHaveBeenCalledWith(
      prefix +
        message +
        ' ["0123456789","0123456789","0123456789","0123456789","0123456789","012345...',
    );
  });

  test('child logger with same handlers', () => {
    const childLogger = logger.getLogger('child-1');
    const prefix = `${mockDateIso} [myApp.child-1] WARNING - `;
    const message = 'this is warning 1';
    childLogger.warning(message);
    expect(logIndicator).toHaveBeenCalledWith(prefix + message);
  });
});
