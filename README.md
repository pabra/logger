# @pabra/logger

[![npm version](https://badge.fury.io/js/%40pabra%2Flogger.svg)](https://www.npmjs.com/package/%40pabra%2Flogger)
[![unit-tests](https://github.com/pabra/logger/workflows/unit-tests/badge.svg?branch=master)](https://github.com/pabra/logger/actions?query=branch%3Amaster+workflow%3Aunit-tests)
[![npm-publish](https://github.com/pabra/logger/workflows/npm-publish/badge.svg)](https://github.com/pabra/logger/actions?query=workflow%3Anpm-publish)
[![codecov](https://codecov.io/gh/pabra/logger/branch/master/graph/badge.svg)](https://codecov.io/gh/pabra/logger)

## What

A JavaScript/TypeScript logger that implements [Syslog severitiy levels](https://en.wikipedia.org/wiki/Syslog#Severity_level).

goals are:

- be lightweight/small
- can be used in browser and node.js
- have as few as possible dependencies (currently just 1)
- (almost) ready to use if you just want to use `console.log` and do not want to log
  debug messages in production
- easily extendable

## Install

```bash
npm install -S @pabra/logger
# or
yarn add @pabra/logger
```

## Simple Usage

### just log everything

This tiny example works the same in browser and node.js.

```typescript
// import
import getLogger from '@pabra/logger';

// init and use root logger
const rootLogger = getLogger('myProject');
rootLogger.info("I'm using a simple logger now!");
// prints to your console:
// 2020-08-13T13:55:32.327Z [myProject] INFORMATIONAL - I'm using a simple logger now!

// init and use child logger in your modules/components/etc.
const moduleLogger = rootLogger.getLogger('myModule');
moduleLogger.warning('something unexpected happened', { some: ['data', true] });
// prints to your console:
// 2020-08-13T13:55:55.497Z [myProject.myModule] WARNING - something unexpected happened { some: [ 'data', true ] }
```

Besides the timestamp and origin (by the name of the logger in square brackets)
you have not much benefit over using `console.log` directly.

### log only important stuff in production

```typescript
// import
import getLogger, { handlers } from '@pabra/logger';

// init and use root logger
const logLevel = process.env.NODE_ENV === 'development' ? undefined : 'warning';
const logHandler = handlers.getConsoleRawDataHandler(logLevel);
const rootLogger = getLogger('myProject', logHandler);
rootLogger.info("I'm using a simple logger now!");
// prints nothing in "production" (or "test")

// init and use child logger in your modules/components/etc.
const moduleLogger = rootLogger.getLogger('myModule');
moduleLogger.warning('something unexpected happened', { some: ['data', true] });
// prints in "development" and "production" to your console:
// 2020-08-13T13:55:55.497Z [myProject.myModule] WARNING - something unexpected happened { some: [ 'data', true ] }
```

In this example we explicitly pass a handler to `getLogger`. Please ready
further down about provided functions and arguemnts if you are interested.

You should take care that `process.env.NODE_ENV` is properly set. This might
also differ if you use it in node.js or browser (there is no global `process` in
the browser - webpack [EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin/)
might help).
