import { consoleTransporter, consoleWithoutDataTransporter } from '../index';

describe('console text transporter', () => {
  test('invalid level', () => {
    expect(() =>
      consoleTransporter(
        { name: 'logger name', nameChain: ['logger name'], handlers: [] },
        {
          raw: 'the message',
          formatted: 'the formatted message',
          data: [],
          level: 'no such level' as any,
        },
      ),
    ).toThrowError();
  });
});

describe('console without data transporter', () => {
  test('invalid level', () => {
    expect(() =>
      consoleWithoutDataTransporter(
        { name: 'logger name', nameChain: ['logger name'], handlers: [] },
        {
          raw: 'the message',
          formatted: 'the formatted message',
          data: [],
          level: 'no such level' as any,
        },
      ),
    ).toThrowError();
  });
});
