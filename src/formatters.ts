import { Formatter } from './types';

const textFormatter: Formatter = (logger, msg) => ({
  ...msg,
  formatted: `${logger.nameChain.join(':')} - ${msg.level}: ${msg.raw}`,
});

export { textFormatter };
