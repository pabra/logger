import { Transporter } from './types';

const consoleTransporter: Transporter = (_logger, { formatted }) => {
  console.log(formatted);
};

export { consoleTransporter };
