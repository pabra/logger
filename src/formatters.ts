import { logLevels } from './levels';
import { Formatter } from './types';

const textFormatter: Formatter = (logger, msg) =>
  `${logger.nameChain.join('.')} ${logLevels[
    msg.level
  ].severity.toUpperCase()}: ${msg.raw}`;

export { textFormatter };
