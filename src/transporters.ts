import type { Transporter } from './types';
import { assertNever } from './utils';

export const consoleTransporter: Transporter = (_logger, msg) => {
  switch (msg.level) {
    case 'emerg':
    case 'alert':
    case 'crit':
    case 'err':
      console.error(msg.messageFormatted, ...msg.data);
      break;

    case 'warning':
      console.warn(msg.messageFormatted, ...msg.data);
      break;

    case 'notice':
    case 'info':
      console.info(msg.messageFormatted, ...msg.data);
      break;

    case 'debug':
      console.debug(msg.messageFormatted, ...msg.data);
      break;

    default:
      assertNever(msg.level);
  }
};

export const consoleWithoutDataTransporter: Transporter = (_logger, msg) => {
  switch (msg.level) {
    case 'emerg':
    case 'alert':
    case 'crit':
    case 'err':
      console.error(msg.messageFormatted);
      break;

    case 'warning':
      console.warn(msg.messageFormatted);
      break;

    case 'notice':
    case 'info':
      console.info(msg.messageFormatted);
      break;

    case 'debug':
      console.debug(msg.messageFormatted);
      break;

    default:
      assertNever(msg.level);
  }
};
