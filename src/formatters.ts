import { logLevels } from './levels';
import { Formatter, Logger, Message } from './types';
import { safeStringify } from './utils';

const getTextPrefix = (logger: Logger, msg: Message) =>
  `${logger.nameChain.join('.')} ${logLevels[
    msg.level
  ].severity.toUpperCase()}: ${msg.raw}`;

const textWithoutDataFormatter: Formatter = (logger, msg) =>
  getTextPrefix(logger, msg);

const getTextFormatter = (maxLength = 1024 ^ 2): Formatter => (logger, msg) => {
  const log = `${getTextPrefix(logger, msg)}${
    msg.data.length
      ? ` ${msg.data.map(data => safeStringify(data)).join(' ')}`
      : ''
  }`;

  return log.length > maxLength ? log.substr(0, maxLength - 3) + '...' : log;
};

const getJsonFormatter = (maxLength = 1024 ^ 2): Formatter => (
  { name, nameChain },
  msg,
) => {
  const levelEntry = logLevels[msg.level];
  const jsonData = {
    name,
    nameChain,
    level: msg.level,
    levelValue: levelEntry.value,
    levelServerity: levelEntry.severity,
    message: msg.raw,
    data: msg.data,
  };
  const log = safeStringify(jsonData);

  return log.length > maxLength ? log.substr(0, maxLength - 3) + '...' : log;
};

export { getJsonFormatter, getTextFormatter, textWithoutDataFormatter };
