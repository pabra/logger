import { logLevels } from './levels';
import { Formatter, Logger, Message } from './types';
import { safeStringify } from './utils';

const getLogTime = () => new Date().toISOString();
const oneMiB = Math.pow(1024, 2);

const getTextPrefix = (logger: Logger, msg: Message) =>
  `${getLogTime()} [${logger.nameChain.join('.')}] ${logLevels[
    msg.level
  ].severity.toUpperCase()} - ${msg.raw}`;

// FIXME: do not just cut off stringified JSON (won't be parsable anymore)
const limitLength = (text: string, lenght: number) =>
  text.length > lenght ? text.substr(0, lenght - 3) + '...' : text;

const textWithoutDataFormatter: Formatter = (logger, msg) =>
  getTextPrefix(logger, msg);

const getTextFormatter = (maxLength = oneMiB): Formatter => (logger, msg) => {
  const log = `${getTextPrefix(logger, msg)}${
    msg.data.length
      ? ` ${msg.data.map(data => safeStringify(data)).join(' ')}`
      : ''
  }`;

  return limitLength(log, maxLength);
};

const getJsonFormatter = (maxLength = oneMiB): Formatter => (
  { name, nameChain },
  msg,
) => {
  const levelEntry = logLevels[msg.level];
  const jsonData = {
    name,
    nameChain,
    time: getLogTime(),
    level: msg.level,
    levelValue: levelEntry.value,
    levelServerity: levelEntry.severity,
    message: msg.raw,
    data: msg.data,
  };

  return limitLength(safeStringify(jsonData), maxLength);
};

export { getJsonFormatter, getTextFormatter, textWithoutDataFormatter };
