[![npm](https://img.shields.io/npm/v/@egomobile/api-log.svg)](https://www.npmjs.com/package/@egomobile/api-log)
[![last build](https://img.shields.io/github/workflow/status/egomobile/api-log/Publish)](https://github.com/egomobile/api-log/actions?query=workflow%3APublish)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/egomobile/api-log/pulls)

# @egomobile/api-log

> A middleware for [js-log](https://github.com/egomobile/js-log), which sends logs to an API endpoint.

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egomobile/api-log
```

The following modules are defined in [peerDependencies](https://nodejs.org/uk/blog/npm/peer-dependencies/) and have to be installed manually:

- [@egomobile/log](https://github.com/egomobile/js-log)

## Configuration

1. Configure with environment variables. Add the following environment variables to your file.

    ```bash
    ENVIRONMENT=<env>

    LOGS_SERVICE_URL=<url>
    LOGS_SERVICE_KEY=<key>
    LOGS_SERVICE_CLIENT=<client>
    ```

2. Pass an object of type IUseApiLoggerOptions to `useApiLogger`

## Usage

```typescript
import log, { consoleLogger, useFallback } from '@egomobile/log';
import { useApiLogger } from "@egomobile/api-log";

// reset the logger to configure it from scratch.
log.reset();

// use api logger as first middleware and console logger as a fallback.
log.use(useFallback(
     useApiLogger(),
     consoleLogger()
));

log.debug({
   message: 'some message',
   details: 'some details'
}); // add environment and severity properties and send request to logs-service.


log.debug('a random string'); // an invalid log, so use console logger fallback.
```

## Documentation

The API documentation can be found [here](https://egomobile.github.io/api-log/).