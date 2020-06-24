import { getMaxLevelFilter } from './filters';
import { textFormatter } from './formatters';
import { consoleTransporter } from './transporters';
import { Handler } from './types';

const consoleTextHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: textFormatter,
  transporter: consoleTransporter,
};

export { consoleTextHandler };
