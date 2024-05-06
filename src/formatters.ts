import { logLevels } from './levels';
import { Formatter, InternalLogger, Message } from './types';
import { safeStringify } from './utils';

const getLogTime = () => new Date().toISOString();
const oneMiB = Math.pow(1024, 2);

const getTextPrefix = (logger: InternalLogger, msg: Message) =>
  `${getLogTime()} [${logger.nameChain.join('.')}] ${logLevels[
    msg.level
  ].severity.toUpperCase()} - ${msg.messageRaw}`;

// FIXME: do not just cut off stringified JSON (won't be parsable anymore)
const limitLength = (text: string, length: number) =>
  text.length > length ? text.slice(0, length - 3) + '...' : text;

export const textWithoutDataFormatter: Formatter = (logger, msg) =>
  getTextPrefix(logger, msg);

export const textFormatter: Formatter = (logger, msg) =>
  `${getTextPrefix(logger, msg)}${
    msg.data.length
      ? ` ${msg.data.map(data => safeStringify(data)).join(' ')}`
      : ''
  }`;

export const getTextLengthFormatter =
  (maxLength = oneMiB): Formatter =>
  (logger, msg) =>
    limitLength(textFormatter(logger, msg), maxLength);

export const jsonFormatter: Formatter = ({ name, nameChain }, msg) => {
  const levelEntry = logLevels[msg.level];
  const jsonData = {
    name,
    nameChain,
    time: getLogTime(),
    level: msg.level,
    levelValue: levelEntry.value,
    levelServerity: levelEntry.severity,
    message: msg.messageRaw,
    data: msg.data,
  };

  return safeStringify(jsonData);
};

export const getJsonLengthFormatter =
  (maxLength = oneMiB): Formatter =>
  (logger, msg) =>
    limitLength(jsonFormatter(logger, msg), maxLength);
