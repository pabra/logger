import getLogger from '../index';

describe('logger names', () => {
  const rootLogger = getLogger({ handlers: [] });

  test('invalid root name', () =>
    expect(() => getLogger({ name: '0', handlers: [] })).toThrowError());

  test('invalid child name', () =>
    expect(() => rootLogger.getLogger({ name: 'root.child1' })).toThrowError());
});
