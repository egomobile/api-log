# Change Log (@egomobile/api-log)

# 0.5.0

- add `withPrefix()` to [IApiLogger interface](https://egomobile.github.io/api-log/interfaces/IApiLogger.html)
- **BREAKING CHANGE**: require [Node.js 18](https://nodejs.org/de/blog/announcements/v18-release-announce) now

## 0.4.6

- implement `IApiLogger` with `createApiLogger()` factory function
- **BREAKING CHANGE**: require [Node.js 16](https://medium.com/the-node-js-collection/node-js-16-available-now-7f5099a97e70) now
- `npm update`s
- apply new [linter settings](https://github.com/egomobile/eslint-config-ego)

## 0.3.1

- Improve support for multiple string values.
  - First string becomes main message, and subsequent strings are added into metadata.

## 0.2.0

- Add support for logging only strings.

## 0.1.0

- Initial release
