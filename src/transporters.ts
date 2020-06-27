import { Transporter } from './types';
import { assertNever } from './utils';

const consoleTransporter: Transporter = (_logger, msg) => {
  switch (msg.level) {
    case 'emerg':
    case 'alert':
    case 'crit':
    case 'err':
      console.error(msg.formatted, ...msg.data);
      break;

    case 'warning':
      console.warn(msg.formatted, ...msg.data);
      break;

    case 'notice':
    case 'info':
      console.info(msg.formatted, ...msg.data);
      break;

    case 'debug':
      console.debug(msg.formatted, ...msg.data);
      break;

    default:
      assertNever(msg.level);
  }
};

const consoleWithoutDataTransporter: Transporter = (_logger, msg) => {
  switch (msg.level) {
    case 'emerg':
    case 'alert':
    case 'crit':
    case 'err':
      console.error(msg.formatted);
      break;

    case 'warning':
      console.warn(msg.formatted);
      break;

    case 'notice':
    case 'info':
      console.info(msg.formatted);
      break;

    case 'debug':
      console.debug(msg.formatted);
      break;

    default:
      assertNever(msg.level);
  }
};

export { consoleTransporter, consoleWithoutDataTransporter };
