import { transporters } from '../src';

describe('console text transporter', () => {
  test('invalid level', () => {
    expect(() =>
      transporters.consoleTransporter(
        { name: 'logger name', nameChain: ['logger name'], handlers: [] },
        {
          raw: 'the message',
          formatted: 'the formatted message',
          data: [],
          level: 'no such level' as any,
        },
      ),
    ).toThrow();
  });
});

describe('console without data transporter', () => {
  test('invalid level', () => {
    expect(() =>
      transporters.consoleWithoutDataTransporter(
        { name: 'logger name', nameChain: ['logger name'], handlers: [] },
        {
          raw: 'the message',
          formatted: 'the formatted message',
          data: [],
          level: 'no such level' as any,
        },
      ),
    ).toThrow();
  });
});
