import MockDate from 'mockdate';
import getLogger, { Filter, formatters, Handler, Transporter } from '../src';

describe('text formatter', () => {
  const mockDate = new Date();
  const mockDateIso = mockDate.toISOString();
  MockDate.set(mockDate);
  const logIndicator = jest.fn();
  const maxLength = 235;
  const filter: Filter = () => true;
  const transporter: Transporter = (_logger, msg) =>
    logIndicator(msg.formatted);
  const handler: Handler = {
    filter,
    formatter: formatters.getJsonLengthFormatter(maxLength),
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

  test('just message', () => {
    const message = 'this is info';
    logger.warning(message);
    expect(logIndicator).toHaveBeenCalledWith(
      `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"${message}","data":[]}`,
    );
  });

  test('maxLength long message', () => {
    const message = new Array(8)
      .fill(null)
      .map((_v, k) => `${String(k + 1).padStart(2, '0')}message+`)
      .join('');
    const expectation = `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"${message}","data":[]}`;
    logger.warning(message);
    expect(expectation.length).toBe(maxLength);
    expect(logIndicator).toHaveBeenCalledWith(expectation);
  });

  test('too long message', () => {
    const message = new Array(9)
      .fill(null)
      .map((_v, k) => `${String(k + 1).padStart(2, '0')}message+`)
      .join('');
    const expectation = `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"01message+02message+03message+04message+05message+06message+07message+08message+09message...`;
    logger.warning(message);
    expect(expectation.length).toBe(maxLength);
    expect(logIndicator).toHaveBeenCalledWith(expectation);
  });

  test('message with data', () => {
    const message = 'msg';
    logger.warning(message, { a: 1 });
    expect(logIndicator).toHaveBeenCalledWith(
      `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"msg","data":[{"a":1}]}`,
    );
  });

  test('message with multiple data', () => {
    const message = 'msg';
    logger.warning(message, { a: 1 }, { b: 2 });
    expect(logIndicator).toHaveBeenCalledWith(
      `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"msg","data":[{"a":1},{"b":2}]}`,
    );
  });

  test('message with error', () => {
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, error);
    expect(logIndicator).toHaveBeenCalledWith(
      `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"msg","data":[{"name":"Error","message":"boom","stack":"dummy"}]}`,
    );
  });

  test('message with error in object', () => {
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, { error });
    expect(logIndicator).toHaveBeenCalledWith(
      `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"msg","data":[{"error":{"name":"Error","message":"boom","stack":"dummy"}}]}`,
    );
  });

  test('message with complex data', () => {
    const message = 'msg';
    logger.warning(message, ['a', { b: 2 }, true, Symbol('x')]);
    expect(logIndicator).toHaveBeenCalledWith(
      `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"msg","data":[["a",{"b":2},true,null]]}`,
    );
  });

  test('message with too long data', () => {
    const message = 'msg';
    logger.warning(
      message,
      new Array(10).fill(null).map(() => '0123456789'),
    );
    expect(logIndicator).toHaveBeenCalledWith(
      `{"name":"${name}","nameChain":["${name}"],"time":"${mockDateIso}","level":"warning","levelValue":4,"levelServerity":"Warning","message":"msg","data":[["0123456789","0123456789","0123456789","0123456789","0123456789","012345678...`,
    );
  });
});
