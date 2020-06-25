import { getMaxLevelFilter } from './filters';
import { textWithoutDataFormatter } from './formatters';
import { consoleTransporter } from './transporters';
import { Handler } from './types';

const consoleTextHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: textWithoutDataFormatter,
  transporter: consoleTransporter,
};

export { consoleTextHandler };
