// https://en.wikipedia.org/wiki/Syslog#Severity_level
const logLevels = {
  emerg: {
    // System is unusable
    value: 0,
    severity: 'Emergency',
  },
  alert: {
    // Action must be taken immediately
    value: 1,
    severity: 'Alert',
  },
  crit: {
    // Critical conditions
    value: 2,
    severity: 'Critical',
  },
  err: {
    // Error conditions
    value: 3,
    severity: 'Error',
  },
  warning: {
    // Warning conditions
    value: 4,
    severity: 'Warning',
  },
  notice: {
    // Normal but significant conditions
    value: 5,
    severity: 'Notice',
  },
  info: {
    // Informational messages
    value: 6,
    severity: 'Informational',
  },
  debug: {
    // Debug-level messages
    value: 7,
    severity: 'Debug',
  },
} as const;

export { logLevels };
