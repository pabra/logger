import { Filter, logLevels, LogLevels } from './types';

const getMaxLevelFilter = (level: keyof LogLevels): Filter => (_logger, msg) =>
  logLevels[msg.level] <= logLevels[level];

export { getMaxLevelFilter };
