import { maxLevelFilter } from './filters';
import { textFormatter } from './formatters';
import { consoleTransporter } from './transporters';
import { Handler } from './types';

const consoleTextHandler: Handler = {
  filter: maxLevelFilter,
  formatter: textFormatter,
  transporter: consoleTransporter,
};

export { consoleTextHandler };
