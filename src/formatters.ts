import { logLevels } from './levels';
import type {
  Formatter,
  InternalLogger,
  JsonValue,
  LogLevelName,
  LogLevelSeverity,
  LogLevelValue,
  Message,
} from './types';
import { limitLength, oneMiB, safeStringify } from './utils';

const getLogTime = () => new Date().toISOString();

const getTextPrefix = <T extends JsonValue>(
  logger: InternalLogger<T>,
  msg: Message,
) =>
  `${getLogTime()} [${logger.nameChain.join('.')}] ${logLevels[
    msg.level
  ].severity.toUpperCase()} - ${msg.messageRaw}`;

export const textWithoutDataFormatter: Formatter<string> = (
  logger,
  msg,
): string => getTextPrefix(logger, msg);

export const textFormatter: Formatter<string> = (logger, msg) =>
  `${getTextPrefix(logger, msg)}${
    msg.data.length
      ? ` ${msg.data.map(data => safeStringify(data)).join(' ')}`
      : ''
  }`;

export const getTextLengthFormatter =
  (maxLength = oneMiB): Formatter<string> =>
  (logger, msg) =>
    limitLength(textFormatter(logger, msg), maxLength);

export type JsonFormatterData = {
  name: string;
  nameChain: string[];
  time: string;
  level: LogLevelName;
  levelValue: LogLevelValue;
  levelServerity: LogLevelSeverity;
  message: string;
  data: any[];
};

export const jsonFormatter: Formatter<JsonFormatterData> = (
  { name, nameChain },
  { level, messageRaw, data },
) => {
  const levelEntry = logLevels[level];
  const jsonData = {
    name,
    nameChain: nameChain as string[],
    time: getLogTime(),
    level: level,
    levelValue: levelEntry.value,
    levelServerity: levelEntry.severity,
    message: messageRaw,
    data: data as any[],
  };

  return jsonData;
};
