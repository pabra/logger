import { Filter, logLevels } from './types';

const maxLevelFilter: Filter = (logger, msg) =>
  logLevels[msg.level] <= logLevels[logger.level];

export { maxLevelFilter };
