import { logLevels } from './levels';
import { Formatter, Logger, Message } from './types';
import { safeStringify } from './utils';

const getTextPrefix = (logger: Logger, msg: Message) =>
  `${logger.nameChain.join('.')} ${logLevels[
    msg.level
  ].severity.toUpperCase()}: ${msg.raw}`;

const limitLength = (text: string, lenght: number) =>
  text.length > lenght ? text.substr(0, lenght - 3) + '...' : text;

const textWithoutDataFormatter: Formatter = (logger, msg) =>
  getTextPrefix(logger, msg);

const getTextFormatter = (maxLength = 1024 ^ 2): Formatter => (logger, msg) => {
  const log = `${getTextPrefix(logger, msg)}${
    msg.data.length
      ? ` ${msg.data.map(data => safeStringify(data)).join(' ')}`
      : ''
  }`;

  return limitLength(log, maxLength);
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

  return limitLength(safeStringify(jsonData), maxLength);
};

export { getJsonFormatter, getTextFormatter, textWithoutDataFormatter };
