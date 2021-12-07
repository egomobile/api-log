// This file is part of the @egomobile/api-log distribution.
// Copyright (c) Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// @egomobile/api-log is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation, version 3.
//
// @egomobile/api-log is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import joi from 'joi';
import axios from 'axios';

import log, { AsyncLoggerMiddleware, LoggerMiddleware, LogType, NextFunction } from '@egomobile/log';
import { IUseApiLoggerOptions } from './types';

const apiLogSchema = joi.object({
    environment: joi.string().strict().valid(
        'dev', 'test', 'prod'
    ).required(),
    body: joi.object().optional(),
    browser: joi.object().optional(),
    cookies: joi.object().optional(),
    headers: joi.object().optional(),
    os: joi.object().optional(),
    runtime: joi.object().optional(),
    sdk: joi.object().optional(),
    message: joi.string().required(),
    details: joi.string().required(),
    severity: joi.string().strict().valid(
        'error', 'debug', 'warning', 'info'
    ).required(),
    metadata: joi.object().optional()
});

/**
 * Creates a new middleware, that stores logs in logs-service.
 *
 * @example
 * ```
 * import log, { consoleLogger, useFallback } from '@egomobile/log';
 * import { useApiLogger } from "@egomobile/api-log";
 *
 * // reset the logger to configure it from scratch.
 * log.reset();
 *
 * // use api logger as first middleware and console logger as a fallback.
 * log.use(useFallback(
 *     useApiLogger(),
 *     consoleLogger()
 * ));
 *
 * log.debug({
 *   message: 'some message',
 *   details: 'some details'
 * }); // add environment and severity properties and send request to logs-service.
 *
 *
 * log.debug('a random string'); // an invalid log, so use console logger fallback.
 * ```
 *
 * @param {IUseApiLoggerOptions|null|undefined} [options] The custom options.
 *
 * @returns {AsyncLoggerMiddleware|LoggerMiddleware} The new middleware.
 */
export function useApiLogger(options?: IUseApiLoggerOptions | null | undefined): AsyncLoggerMiddleware | LoggerMiddleware {
    const url = options?.url || process.env.LOGS_SERVICE_URL as string;
    if (typeof url !== 'string') {
        throw new TypeError('url must be of type string');
    }

    const key = options?.key || process.env.LOGS_SERVICE_KEY as string;
    if (typeof key !== 'string') {
        throw new TypeError('key must be of type string');
    }

    const client = options?.client || process.env.LOGS_SERVICE_CLIENT as string;
    if (typeof client !== 'string') {
        throw new TypeError('client must be of type string');
    }

    const config = {
        headers: {
            'x-api-key': key,
            'x-api-client': client
        }
    };

    let environment = process.env.ENVIRONMENT?.toLowerCase().trim();
    if (!environment?.length) {
        const nodeEnv = process.env.NODE_ENV?.toLowerCase().trim();
        if (nodeEnv === 'development') {
            environment = 'dev';
        }
    }

    if (!environment?.length) {
        environment = 'prod';
    }

    return (type: LogType, args: any[], done?: NextFunction) => {
        if (!done) {
            done = () => { };
        }
        let severity: string;
        switch (type) {
            case LogType.Error:
                severity = 'error';
                break;
            case LogType.Debug:
                severity = 'debug';
                break;
            case LogType.Warn:
                severity = 'warning';
                break;
            case LogType.Info:
                severity = 'info';
                break;
            case LogType.Default:
                severity = 'info';
                break;
            default:
                throw new TypeError('log type must come from enum');
        }

        const data = args[0];
        const log = { ...data, environment, severity };
        const validationResult = apiLogSchema.validate(log);
        if (validationResult.error) {
            done!(new Error(validationResult.error.message));
        } else {
            axios
                .post(url, log, config)
                .then(response => {
                    if (response.status !== 200) {
                        done!(new Error(`Unexpected response: ${response.status}`));
                    } else {
                        done!();
                    }
                })
                .catch(error => {
                    done!(error);
                });
        }
    };
};

// export everything from @egomobile/log.
export * from '@egomobile/log';

// make default logger instance available as
// default export
export default log;