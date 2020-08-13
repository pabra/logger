import { logLevels } from './levels';
import { Filter, LogLevels } from './types';
import { isLogLevelName } from './utils';

const getMaxLevelFilter = (level: keyof LogLevels): Filter => {
  if (!isLogLevelName(level)) {
    throw new Error('invalid log level name');
  }

  return (_logger, msg) => logLevels[msg.level].value <= logLevels[level].value;
};

export { getMaxLevelFilter };
