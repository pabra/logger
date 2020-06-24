import { Transporter } from './types';

const consoleTransporter: Transporter = (_logger, msg) => {
  console.log(msg.formatted);
  return true;
};

export { consoleTransporter };
