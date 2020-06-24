/* eslint-disable import/no-unused-modules */
import { getLogger } from './logger';

export { getMaxLevelFilter } from './filters';
export { textFormatter } from './formatters';
export { consoleTextHandler } from './handlers';
export { logLevels } from './levels';
export { consoleTransporter } from './transporters';
export type { Filter, Formatter, Handler, Transporter } from './types';
export default getLogger;
