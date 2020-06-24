import { Formatter } from './types';

const textFormatter: Formatter = (logger, msg) =>
  `${logger.nameChain.join(':')} - ${msg.level}: ${msg.raw}`;

export { textFormatter };
