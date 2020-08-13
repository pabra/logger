import getLogger, { filters, Formatter, Transporter } from '../src';

describe('childlogger with lower levels', () => {
  const logIndicator = jest.fn();
  const formatter: Formatter = (logger, msg) =>
    `${logger.nameChain.join('+')} ${msg.level}: ${msg.raw}`;
  const transporter: Transporter = (_logger, { formatted }) =>
    logIndicator(formatted);
  const rootLogger = getLogger('main', {
    filter: filters.getMaxLevelFilter('info'),
    formatter,
    transporter,
  });

  afterEach(() => logIndicator.mockReset());

  test('main emerg', () => {
    const message = 'this is emerg';
    rootLogger.emerg(message);
    expect(logIndicator).toHaveBeenCalledWith('main emerg: ' + message);
  });

  test('main alert', () => {
    const message = 'this is alert';
    rootLogger.alert(message);
    expect(logIndicator).toHaveBeenCalledWith('main alert: ' + message);
  });

  test('main crit', () => {
    const message = 'this is crit';
    rootLogger.crit(message);
    expect(logIndicator).toHaveBeenCalledWith('main crit: ' + message);
  });

  test('main err', () => {
    const message = 'this is err';
    rootLogger.err(message);
    expect(logIndicator).toHaveBeenCalledWith('main err: ' + message);
  });

  test('main warning', () => {
    const message = 'this is warning';
    rootLogger.warning(message);
    expect(logIndicator).toHaveBeenCalledWith('main warning: ' + message);
  });

  test('main notice', () => {
    const message = 'this is notice';
    rootLogger.notice(message);
    expect(logIndicator).toHaveBeenCalledWith('main notice: ' + message);
  });

  test('main info', () => {
    const message = 'this is info';
    rootLogger.info(message);
    expect(logIndicator).toHaveBeenCalledWith('main info: ' + message);
  });

  test('main debug', () => {
    const message = 'this is debug';
    rootLogger.debug(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  const childLogger = rootLogger.getLogger('subLog', {
    filter: filters.getMaxLevelFilter('crit'),
    formatter,
    transporter,
  });

  test('child emerg', () => {
    const message = 'this is emerg';
    childLogger.emerg(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog emerg: ' + message);
  });

  test('child alert', () => {
    const message = 'this is alert';
    childLogger.alert(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog alert: ' + message);
  });

  test('child crit', () => {
    const message = 'this is crit';
    childLogger.crit(message);
    expect(logIndicator).toHaveBeenCalledWith('main+subLog crit: ' + message);
  });

  test('child err', () => {
    const message = 'this is err';
    childLogger.err(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child warning', () => {
    const message = 'this is warning';
    childLogger.warning(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child notice', () => {
    const message = 'this is notice';
    childLogger.notice(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child info', () => {
    const message = 'this is info';
    childLogger.info(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });

  test('child debug', () => {
    const message = 'this is debug';
    childLogger.debug(message);
    expect(logIndicator).not.toHaveBeenCalled();
  });
});
