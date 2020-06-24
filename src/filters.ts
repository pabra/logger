import { logLevels } from './levels';
import { Filter, LogLevels } from './types';

const getMaxLevelFilter = (level: keyof LogLevels): Filter => (_logger, msg) =>
  logLevels[msg.level].value <= logLevels[level].value;

export { getMaxLevelFilter };
