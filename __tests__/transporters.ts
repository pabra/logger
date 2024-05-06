import { transporters } from '../src';

describe('console text transporter', () => {
  test('invalid level', () => {
    expect(() =>
      transporters.consoleTransporter(
        { name: 'logger name', nameChain: ['logger name'], handlers: [] },
        {
          messageRaw: 'the message',
          messageFormatted: 'the formatted message',
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
          messageRaw: 'the message',
          messageFormatted: 'the formatted message',
          data: [],
          level: 'no such level' as any,
        },
      ),
    ).toThrow();
  });
});
