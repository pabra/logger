import getLogger from '../index';

describe('simple logger', () => {
  const mockLog = jest.fn();
  const originalConsoleLog = console.log;
  console.log = mockLog;
  const logger = getLogger();
  afterAll(() => (console.log = originalConsoleLog));
  it('should add', () => {
    logger.warning('this is a warning');
    expect(mockLog).toHaveBeenCalledWith('root: this is a warning');
  });
});
