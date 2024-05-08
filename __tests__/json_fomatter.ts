import MockDate from 'mockdate';
import type {
  Filter,
  Formatter,
  Handler,
  JsonFormatterData,
  Transporter,
} from '../src';
import getLogger, { formatters } from '../src';

describe('json formatter', () => {
  const mockDate = new Date();
  const mockDateIso = mockDate.toISOString();
  MockDate.set(mockDate);
  const logIndicator = jest.fn();
  const filter: Filter = () => true;
  const formatter: Formatter<JsonFormatterData> = formatters.jsonFormatter;
  const transporter: Transporter<JsonFormatterData> = (
    _logger,
    _message,
    messageFormatted,
  ) => logIndicator(messageFormatted);
  const handler: Handler<JsonFormatterData> = {
    filter,
    formatter,
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
    expect(logIndicator).toHaveBeenCalledWith({
      data: [],
      level: 'warning',
      levelServerity: 'Warning',
      levelValue: 4,
      message: 'this is info',
      name: 'myApp',
      nameChain: ['myApp'],
      time: mockDateIso,
    });
  });

  test('message with data', () => {
    const message = 'msg';
    logger.warning(message, { a: 1 });
    expect(logIndicator).toHaveBeenCalledWith({
      data: [{ a: 1 }],
      level: 'warning',
      levelServerity: 'Warning',
      levelValue: 4,
      message: 'msg',
      name: 'myApp',
      nameChain: ['myApp'],
      time: mockDateIso,
    });
  });

  test('message with multiple data', () => {
    const message = 'msg';
    logger.warning(message, { a: 1 }, { b: 2 });
    expect(logIndicator).toHaveBeenCalledWith({
      data: [{ a: 1 }, { b: 2 }],
      level: 'warning',
      levelServerity: 'Warning',
      levelValue: 4,
      message: 'msg',
      name: 'myApp',
      nameChain: ['myApp'],
      time: mockDateIso,
    });
  });

  test('message with error', () => {
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, error);
    expect(logIndicator).toHaveBeenCalledWith({
      data: [error],
      level: 'warning',
      levelServerity: 'Warning',
      levelValue: 4,
      message: 'msg',
      name: 'myApp',
      nameChain: ['myApp'],
      time: mockDateIso,
    });
  });

  test('message with error in object', () => {
    const message = 'msg';
    const error = new Error('boom');
    error.stack = 'dummy';
    logger.warning(message, { error });
    expect(logIndicator).toHaveBeenCalledWith({
      data: [{ error: error }],
      level: 'warning',
      levelServerity: 'Warning',
      levelValue: 4,
      message: 'msg',
      name: 'myApp',
      nameChain: ['myApp'],
      time: mockDateIso,
    });
  });

  test('message with complex data', () => {
    const message = 'msg';
    const symb = Symbol('x');
    logger.warning(message, ['a', { b: 2 }, true, symb]);
    expect(logIndicator).toHaveBeenCalledWith({
      data: [['a', { b: 2 }, true, symb]],
      level: 'warning',
      levelServerity: 'Warning',
      levelValue: 4,
      message: 'msg',
      name: 'myApp',
      nameChain: ['myApp'],
      time: mockDateIso,
    });
  });

  test('message with too long data', () => {
    const message = 'msg';
    logger.warning(
      message,
      new Array(10).fill(null).map(() => '0123456789'),
    );
    expect(logIndicator).toHaveBeenCalledWith({
      data: [
        [
          '0123456789',
          '0123456789',
          '0123456789',
          '0123456789',
          '0123456789',
          '0123456789',
          '0123456789',
          '0123456789',
          '0123456789',
          '0123456789',
        ],
      ],
      level: 'warning',
      levelServerity: 'Warning',
      levelValue: 4,
      message: 'msg',
      name: 'myApp',
      nameChain: ['myApp'],
      time: mockDateIso,
    });
  });
});
