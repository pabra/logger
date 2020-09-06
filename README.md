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
- (almost) ready to use if you just want to use `console.log` and do not want to
  log debug messages in production
- easily extendable
- functional code and immutable data

A [Logger](#logger) consists of 3 parts:

- [Filter](#filter) (optional) - should a message be logged at all
- [Formatter](#formatter) - how to format log entries
- [Transporter](#transporter) - where to trasport log entries to

These are packed together into a [Handler](#handler).

## Install

```bash
npm install --save @pabra/logger
# or
yarn add @pabra/logger
```

## Getting Started

### Just Log

This works in both, browser and node.js environments.

```typescript
// import
import getLogger from '@pabra/logger';

// init and use root logger
const rootLogger = getLogger('myProject');

rootLogger.info("I'm using a simple logger now!");
```

Results in the following console output:

```console
2020-08-13T13:55:32.327Z [myProject] INFORMATIONAL - I'm using a simple logger now!
```

### Logging Data

Pass any additional data after the log message.

```typescript
rootLogger.warning('something unexpected happened', { some: ['data', true] }, '23', 42 );
```

Results in the following console output:

```console
2020-09-06T07:29:05.356Z [myProject] WARNING - something unexpected happened { some: [ 'data', true ] } 23 42
```

### Child Logger

Call `getLogger` on your rootLogger to get a child logger.

```typescript
// import
import getLogger from '@pabra/logger';

// init root logger
const rootLogger = getLogger('myProject');

// init and use child logger in your modules/components/etc.
const moduleLogger = rootLogger.getLogger('myModule');
moduleLogger.info('Logging from within a module!');
```

Results in the following console output:

```console
2020-09-06T07:39:08.677Z [myProject.myModule] INFORMATIONAL - Logging from within a module!
```

### Selectively Logging for Dev / Prod

Set up a custom [Handler](#handler) to only show log messages starting at
'warning' level in production:

```typescript
import getLogger, { handlers } from '@pabra/logger';

const logLevel = process.env.NODE_ENV === 'development' ? undefined : 'warning';
const logHandler = handlers.getConsoleRawDataHandler(logLevel);
const rootLogger = getLogger('myProject', logHandler);
// in some module
const moduleLogger = rootLogger.getLogger('myModule');
```

Then, any log messages that are lower than "warning" will be ignored.

```typescript
rootLogger.info("I'm using a simple logger now!");
moduleLogger.notice("I'm using a simple module logger now!");
rootLogger.err('No such table in db.');
moduleLogger.warning('User entered invalid user name.');
```

Will only show messages eqal or higher than 'warning' level:

```console
2020-09-06T07:53:40.896Z [myProject] ERROR - No such table in db.
2020-09-06T07:53:40.896Z [myProject.myModule] WARNING - User entered invalid user name.
```

You should take care that `process.env.NODE_ENV` is properly set. This might
also differ if you use it in node.js or browser (there is no global `process` in
the browser - webpack
[EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin/) might
help with that).

## Usage

### Logger

#### What is it

```typescript
type Logger = {
  emerg: (message: string, ...data: any[]) => void;
  alert: (message: string, ...data: any[]) => void;
  crit: (message: string, ...data: any[]) => void;
  err: (message: string, ...data: any[]) => void;
  warning: (message: string, ...data: any[]) => void;
  notice: (message: string, ...data: any[]) => void;
  info: (message: string, ...data: any[]) => void;
  debug: (message: string, ...data: any[]) => void;
  getLogger: GetLogger;
  getHandlers: () => Handlers;
};
```

#### How to get it

```typescript
import getLogger from '@pabra/logger'

// get a main/root logger
const mainLogger = getLogger(loggerName);               // default handler will be used
// or
const mainLogger = getLogger(loggerName, handler);
// or
const mainLogger = getLogger(loggerName, handlers);

// get a child/module logger
const moduleLogger = mainLogger.getLogger(loggerName);  // parent's handlers will be used
// or
const moduleLogger = mainLogger.getLogger(loggerName, handler);
// or
const moduleLogger = mainLogger.getLogger(loggerName, handlers);
```

| object       | type                                                                                                                                                                                                                                                                              | required | description                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------- |
| `loggerName` | <pre>string</pre>                                                                                                                                                                                                                                                                 |   yes    | name of your logger             |
| `handler`    | <pre>type&nbsp;Handler&nbsp;=&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;readonly&nbsp;filter?:&nbsp;Filter&nbsp;\|&nbsp;undefined;<br>&nbsp;&nbsp;&nbsp;&nbsp;readonly&nbsp;formatter:&nbsp;Formatter;<br>&nbsp;&nbsp;&nbsp;&nbsp;readonly&nbsp;transporter:&nbsp;Transporter;<br>}</pre> |    no    | a single [`Handler`](#handler)  |
| `handlers`   | <pre>Handler[]</pre>                                                                                                                                                                                                                                                              |    no    | multiple [`Handler`](#handler)s |

#### How to use it

```typescript
moduleLogger.info(message, ...data);
```

| object         | type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | required | description                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------- |
| `moduleLogger` | <pre>type&nbsp;Logger&nbsp;=&nbsp;{<br>&nbsp;&nbsp;emerg:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;alert:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;crit:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;err:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;warning:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;notice:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;info:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;debug:&nbsp;(message:&nbsp;string,&nbsp;...data:&nbsp;any[])&nbsp;=>&nbsp;void;<br>&nbsp;&nbsp;getLogger:&nbsp;GetLogger;<br>&nbsp;&nbsp;getHandlers:&nbsp;()&nbsp;=>&nbsp;Handlers;<br>};</pre> |          | the actual [`Logger`](#logger) Object |
| `message`      | <pre>string</pre>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |   yes    | a message to log                      |
| `data`         | <pre>any</pre>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |    no    | some kind of data to log              |

For each call of a log function the [`Logger`](#logger) will pass the message
and data to each of it's [`Handler`](#handler)s.

### Handler

#### What is it

```typescript
type Handler = {
  readonly filter?: Filter;
  readonly formatter: Formatter;
  readonly transporter: Transporter;
};
```

A [`Handler`](#handler) keeps all 3 parts together that are needed to handle a
log entry - hence the name. Whereas the filter is optional.

#### How to get it

```typescript
import { handlers, Handler } from '@pabra/logger';

const myHandler: Handler = handlers.getConsoleTextHandler(logLevelName);
const myHandler: Handler = handlers.getConsoleRawDataHandler(logLevelName);
const myHandler: Handler = handlers.getConsoleJsonHandler(logLevelName);
```

| object                     | type                                                                                                                                                                                                                                                                                             | required | description                                                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handlers`                 | <pre>{<br>&nbsp;&nbsp;getConsoleTextHandler,<br>&nbsp;&nbsp;getConsoleRawDataHandler,<br>&nbsp;&nbsp;getConsoleJsonHandler,<br>}&nbsp;as&nbsp;const;</pre>                                                                                                                                       |          | an object of common handlers                                                                                                                                                                            |
| `logLevelName`             | <pre>type&nbsp;LogLevelName&nbsp;=<br>&nbsp;&nbsp;\|&nbsp;'emerg'<br>&nbsp;&nbsp;\|&nbsp;'alert'<br>&nbsp;&nbsp;\|&nbsp;'crit'<br>&nbsp;&nbsp;\|&nbsp;'err'<br>&nbsp;&nbsp;\|&nbsp;'warning'<br>&nbsp;&nbsp;\|&nbsp;'notice'<br>&nbsp;&nbsp;\|&nbsp;'info'<br>&nbsp;&nbsp;\|&nbsp;'debug';</pre> |    no    | The name of the maximal log level to handle (low log levels are more urgent than higher ones). If none is passed (or `undefined`) that Hanlder won't filter - means everything get's logged.            |
| `getConsoleRawDataHandler` | <pre>(<br>&nbsp;&nbsp;level?:&nbsp;LogLevelName&nbsp;\|&nbsp;undefined,<br>)&nbsp;=>&nbsp;Handler</pre>                                                                                                                                                                                          |          | This is the default [`Handler`](#handler) if you don't pass one to `getLogger`. It mostly works like `console.log`. It doesn't has a [`Formatter`](#formatter) and just passes the raw data to console. |
| `getConsoleTextHandler`    | <pre>(<br>&nbsp;&nbsp;level?:&nbsp;LogLevelName&nbsp;\|&nbsp;undefined,<br>)&nbsp;=>&nbsp;Handler</pre>                                                                                                                                                                                          |          | This [`Handler`](#handler) will be best for human readability.                                                                                                                                          |
| `getConsoleJsonHandler`    | <pre>(<br>&nbsp;&nbsp;level?:&nbsp;LogLevelName&nbsp;\|&nbsp;undefined,<br>)&nbsp;=>&nbsp;Handler</pre>                                                                                                                                                                                          |          | This [`Handler`](#handler) will be best for machine readability as it will be one big strigified JSON line.                                                                                             |

#### How to make it

```typescript
import { Handler } from '@pabra/logger';

const myHandler: Handler = {
  filter: myFilter,
  formatter: myFormatter,
  transporter: myTransporter,
};
```

### Filter

#### What is it

```typescript
type Filter = (logger: InternalLogger, message: Message) => boolean;
type InternalLogger = {
  readonly name: string;
  readonly nameChain: string[];
  readonly handlers: Handler[];
};
interface Message {
  readonly raw: string;
  readonly data: any[];
  readonly level: "emerg" | "alert" | "crit" | "err" | "warning" | "notice" | "info" | "debug";
}
```

The [`Filter`](#filter) function decides if a log entry should be handled at
all. If it returns `false` the log entry handling immediately ends for this
handler.

If there is no [`Filter`](#filter) provided in a [`Handler`](#handler), every
log entry gets handled. So no [`Filter`](#filter) behaves the same as a
[`Filter`](#filter) that's always returning `true`.

#### How to get it

```typescript
import { filters, Filter } from '@pabra/logger'

const myFilter: Filter = filters.getMaxLevelFilter(logLevelName)
```

| object              | type                                                                                                                                                                                                                                                                                             | required | description                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filters`           | <pre>{&nbsp;getMaxLevelFilter&nbsp;}&nbsp;as&nbsp;const;</pre>                                                                                                                                                                                                                                   |          | an object of common filters                                                                                                                                                                                              |
| `logLevelName`      | <pre>type&nbsp;LogLevelName&nbsp;=<br>&nbsp;&nbsp;\|&nbsp;'emerg'<br>&nbsp;&nbsp;\|&nbsp;'alert'<br>&nbsp;&nbsp;\|&nbsp;'crit'<br>&nbsp;&nbsp;\|&nbsp;'err'<br>&nbsp;&nbsp;\|&nbsp;'warning'<br>&nbsp;&nbsp;\|&nbsp;'notice'<br>&nbsp;&nbsp;\|&nbsp;'info'<br>&nbsp;&nbsp;\|&nbsp;'debug';</pre> |   yes    | The name of the maximal log level to handle (low log levels are more urgent than higher ones).                                                                                                                           |
| `getMaxLevelFilter` | <pre>(<br>&nbsp;&nbsp;level:&nbsp;LogLevelName,<br>)&nbsp;=>&nbsp;Filter</pre>                                                                                                                                                                                                                   |          | This Filter decides based on the severity of the log entry weather it should be logged/handled or not (low levels are more urgent - see [Syslog severitiy levels](https://en.wikipedia.org/wiki/Syslog#Severity_level)). |

#### How to make it

A [`Filter`](#filter) is a function that gets the `InternalLogger` object and
the `Message` object passed as arguments and needs to return a boolean.

If you want to have a [`Handler`](#handler) that should only handle `error` log
entries, your [`Filter`](#filter) could look like this:

```typescript
import { Filter } from '@pabra/logger'

const myFilter: Filter = (_logger, message) =>
  message.level === 'err';

// or if you only want to handle log entries from your "auth" module
const myFilter: Filter = (logger, _message) =>
  logger.name === 'auth';
```

### Formatter

#### What is it

```typescript
type Formatter = (logger: InternalLogger, message: Message) => string;
type InternalLogger = {
  readonly name: string;
  readonly nameChain: string[];
  readonly handlers: Handler[];
};
interface Message {
  readonly raw: string;
  readonly data: any[];
  readonly level: "emerg" | "alert" | "crit" | "err" | "warning" | "notice" | "info" | "debug";
}
```

The [`Formatter`](#formatter) function produces the formatted message (`string`)
that finally appears in your log file/console/etc. It might add a time stamp and
than somehow join the severity level/name, logger name, raw log message and log
data into one string.

#### How to get it

```typescript
import { formatters, Formatter } from '@pabra/logger';

const myFormatter: Formatter = formatters.jsonFormatter;
const myFormatter: Formatter = formatters.textFormatter;
const myFormatter: Formatter = formatters.textWithoutDataFormatter;
const myFormatter: Formatter = formatters.getJsonLengthFormatter(maxLength);
const myFormatter: Formatter = formatters.getTextLengthFormatter(maxLength);
```

| object                     | type                                                                                                                                                                                                                     | required | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formatters`               | <pre>{<br>&nbsp;&nbsp;textWithoutDataFormatter,<br>&nbsp;&nbsp;textFormatter,<br>&nbsp;&nbsp;jsonFormatter,<br>&nbsp;&nbsp;getTextLengthFormatter,<br>&nbsp;&nbsp;getJsonLengthFormatter,<br>}&nbsp;as&nbsp;const;</pre> |          | an object of common formatters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `maxLength`                | <pre>undefined&nbsp;\|&nbsp;number</pre>                                                                                                                                                                                 |    no    | The maximum length of your formatted log message. If `undefined` or omitted the default is `1024^2` (1 MiB). It is there to prevent you from potentially sending huge data objects over the wire. <br>**Notice:** if used with `jsonFormatter` the stringified data will end up truncated and not parseable anymore.                                                                                                                                                                                                         |
| `jsonFormatter`            | <pre>Formatter</pre>                                                                                                                                                                                                     |          | Will return untruncated, stringified JSON like this: <pre>{<br>&nbsp;&nbsp;"name":&nbsp;"auth",<br>&nbsp;&nbsp;"nameChain":&nbsp;["main",&nbsp;"auth"],<br>&nbsp;&nbsp;"time":&nbsp;"2020-08-16T08:23:43.395Z",<br>&nbsp;&nbsp;"level":&nbsp;"debug",<br>&nbsp;&nbsp;"levelValue":&nbsp;7,<br>&nbsp;&nbsp;"levelServerity":&nbsp;"Debug",<br>&nbsp;&nbsp;"message":&nbsp;"failed&nbsp;to&nbsp;login",<br>&nbsp;&nbsp;"data":&nbsp;[{&nbsp;"user":&nbsp;"bob"&nbsp;}]<br>}</pre> <br>Can handle instances of `Error` as data. |
| `textFormatter`            | <pre>Formatter</pre>                                                                                                                                                                                                     |          | Will return untruncated, text like this: `2020-08-16T08:45:08.297Z [main.auth] DEBUG - failed to login {"user":"bob"}` <br>Can handle instances of `Error` as data.                                                                                                                                                                                                                                                                                                                                                          |
| `textWithoutDataFormatter` | <pre>Formatter</pre>                                                                                                                                                                                                     |          | This [`Formatter`](#formatter) will just return the raw message without trying to serialize data. It's used for `getConsoleRawDataHandler` to be able to pass arbitrary objects like DOM Nodes or Events to the console which could not be serialized by JSON.stringify otherwise.                                                                                                                                                                                                                                           |
| `getJsonLengthFormatter`   | <pre>(<br>&nbsp;&nbsp;maxLength?:&nbsp;number&nbsp;\|&nbsp;undefined,<br>)&nbsp;=>&nbsp;Formatter</pre>                                                                                                                  |          | Will return length limited `jsonFormatter`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `getTextLengthFormatter`   | <pre>(<br>&nbsp;&nbsp;maxLength?:&nbsp;number&nbsp;\|&nbsp;undefined,<br>)&nbsp;=>&nbsp;Formatter</pre>                                                                                                                  |          | Will return length limited `textFormatter`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

#### How to make it

A [`Formatter`](#formatter) is a function that gets the `InternalLogger` object
and the `Message` object passed as arguments and needs to return a string.

A very simple [`Formatter`](#formatter) (for the sake of simplicity ignores
data) could look like this:

```typescript
import { Formatter } from '@pabra/logger';

const myFormatter: Formatter = (logger, message) =>
  `${new Date().toISOString()} [${logger.name}] ${message.level}: ${message.raw}`;
```

### Transporter

#### What is it

```typescript
type Transporter = (logger: InternalLogger, message: MessageFormatted) => void;
type InternalLogger = {
  readonly name: string;
  readonly nameChain: string[];
  readonly handlers: Handler[];
};
interface MessageFormatted {
  readonly raw: string;
  readonly data: DataArgs;
  readonly level: LogLevelName;
  readonly formatted: string;
}
```

The [`Transporter`](#transporter) "transports" the formatted message to its
destination. That might be the `console`, a file, some http endpoint, etc.

#### How to get it

```typescript
import { transporters, Transporter } from '@pabra/logger';

const myTransporter: Transporter = transporters.consoleTransporter;
const myTransporter: Transporter = transporters.consoleWithoutDataTransporter;
```

| object                          | type                                                                                                                  | required | description                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transporters`                  | <pre>{<br>&nbsp;&nbsp;consoleTransporter,<br>&nbsp;&nbsp;consoleWithoutDataTransporter,<br>}&nbsp;as&nbsp;const</pre> |          | an object of common transporters                                                                                                                                                                                                                                                                                                                  |
| `consoleTransporter`            | <pre>Transporter</pre>                                                                                                |          | It passes the formated message **and** data to the console. It's used by the default [`Handler`](#handler) (`getConsoleRawDataHandler` - used if no [`Handler`](#handler) is passed to `getLogger`). It can be used if you want to pass arbitrary objects (like DOM Nodes, Events, etc.) to the console without having formatter dealt with them. |
| `consoleWithoutDataTransporter` | <pre>Transporter</pre>                                                                                                |          | It passes only the formatted message to the console. A [`Formatter`](#formatter) should have taken care, that data became part of formatted message. It's used by `getConsoleTextHandler` and `getConsoleJsonHandler`.                                                                                                                            |

#### How to make it

A [`Transporter`](#transporter) is a function that gets the `InternalLogger`
object and the `MessageFormatted` object passed as arguments and needs to return
nothing (`viod`).

A very simple `Tranporter` to POST to your logging server might look like:

```typescript
import { Transporter } from '@pabra/logger';

const myTransporter: Transporter = (_logger, message) =>
  void fetch('https://example.com', {
    method: 'POST',
    body: message.formatted,
  });
```
