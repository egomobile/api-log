/* eslint-disable id-blacklist */

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

import log, { ILogger, LogAction } from "@egomobile/log";
import { get as getStacktrace, StackFrame } from "stack-trace";
import { ApiLogMetadata, IApiLog } from "..";
import { isNil } from "../../utils/internal";
import type { Nilable } from "../internal";

/**
 * A logger for strict API messages.
 */
export interface IApiLogger {
    /**
     * Write strict typed DEBUG message.
     *
     * @example
     * ```
     * import { ApiLogger } from '@egomobile/log'
     *
     * const log = new ApiLogger();
     * log.debug('my message')
     * log.debug('my message', 'my details')
     * log.debug('my message with metadata', { foo: 42 })
     * log.debug('my message with metadata', 'and details', { foo: 42 })
     * ```
     */
    debug(log: IApiLog): void;
    debug(message: string): void;
    debug(message: string, details: string): void;
    debug(message: string, metadata: ApiLogMetadata): void;
    debug(message: string, details: string, metadata: ApiLogMetadata): void;

    /**
     * Write strict typed ERROR message.
     *
     * @example
     * ```
     * import { ApiLogger } from '@egomobile/log'
     *
     * const log = new ApiLogger();
     * log.error('my message')
     * log.error('my message', 'my details')
     * log.error('my message with metadata', { foo: 42 })
     * log.error('my message with metadata', 'and details', { foo: 42 })
     * ```
     */
    error(log: IApiLog): void;
    error(message: string): void;
    error(message: string, details: string): void;
    error(message: string, metadata: ApiLogMetadata): void;
    error(message: string, details: string, metadata: ApiLogMetadata): void;

    /**
     * Write strict typed INFO message.
     *
     * @example
     * ```
     * import { ApiLogger } from '@egomobile/log'
     *
     * const log = new ApiLogger();
     * log.info('my message')
     * log.info('my message', 'my details')
     * log.info('my message with metadata', { foo: 42 })
     * log.info('my message with metadata', 'and details', { foo: 42 })
     * ```
     */
    info(log: IApiLog): void;
    info(message: string): void;
    info(message: string, details: string): void;
    info(message: string, metadata: ApiLogMetadata): void;
    info(message: string, details: string, metadata: ApiLogMetadata): void;

    /**
     * Write strict typed TRACE message.
     *
     * @example
     * ```
     * import { ApiLogger } from '@egomobile/log'
     *
     * const log = new ApiLogger();
     * log.trace('my message')
     * log.trace('my message', 'my details')
     * log.trace('my message with metadata', { foo: 42 })
     * log.trace('my message with metadata', 'and details', { foo: 42 })
     * ```
     */
    trace(log: IApiLog): void;
    trace(message: string): void;
    trace(message: string, details: string): void;
    trace(message: string, metadata: ApiLogMetadata): void;
    trace(message: string, details: string, metadata: ApiLogMetadata): void;

    /**
     * Write strict typed WARNING message.
     *
     * @example
     * ```
     * import { ApiLogger } from '@egomobile/log'
     *
     * const log = new ApiLogger();
     * log.warn('my message')
     * log.warn('my message', 'my details')
     * log.warn('my message with metadata', { foo: 42 })
     * log.warn('my message with metadata', 'and details', { foo: 42 })
     * ```
     */
    warn(log: IApiLog): void;
    warn(message: string): void;
    warn(message: string, details: string): void;
    warn(message: string, metadata: ApiLogMetadata): void;
    warn(message: string, details: string, metadata: ApiLogMetadata): void;
}

class ApiLogger implements IApiLogger {
    /**
     * Initializes a new instance of that class.
     *
     * @param {ILogger} logger The (custom) logger to use.
     */
    public constructor(public readonly logger: ILogger) {
    }

    #executeAction(
        action: LogAction,
        messageOrLog: string | IApiLog, detailsOrMetadata: Nilable<string | ApiLogMetadata>, metadata: Nilable<ApiLogMetadata>
    ) {
        let apiLog: IApiLog;
        if (typeof messageOrLog === "string") {
            let details: string;
            if (typeof detailsOrMetadata === "string") {
                details = detailsOrMetadata;
            }
            else if (typeof detailsOrMetadata === "object") {
                details = messageOrLog;
                metadata = detailsOrMetadata;
            }
            else {
                throw new TypeError("detailsOrMetadata must be of type string or object");
            }

            if (!isNil(metadata)) {
                if (typeof metadata !== "object") {
                    throw new TypeError("metadata must be of type object");
                }
            }

            const stackFrames: StackFrame[] = [];
            let stack: any;
            try {
                stackFrames.push(
                    ...getStacktrace()
                );
            }
            catch {
                stack = new Error().stack;
            }

            apiLog = {
                "message": messageOrLog,
                details,
                "metadata": {
                    "stackTrace": {
                        "value": stack ?? stackFrames.map((frame) => {
                            try {
                                return {
                                    "isNative": frame.isNative(),
                                    "file": frame.getFileName(),
                                    "line": frame.getLineNumber(),
                                    "column": frame.getColumnNumber(),
                                    "type": frame.getTypeName(),
                                    "method": frame.getMethodName(),
                                    "isConstructor": frame.isConstructor()
                                };
                            }
                            catch {
                                return false;
                            }
                        }).filter((x => {
                            return !!x;
                        }))
                    },
                    ...(metadata ?? {})
                }
            };
        }
        else if (typeof messageOrLog === "object") {
            apiLog = messageOrLog;
        }
        else {
            throw new TypeError("messageOrLog must be of type string or object");
        }

        action.bind(this.logger)(apiLog);
    }

    public debug(messageOrLog: string | IApiLog, detailsOrMetadata?: Nilable<string | ApiLogMetadata>, metadata?: Nilable<ApiLogMetadata>): void {
        return this.#executeAction(
            this.logger.debug,
            messageOrLog, detailsOrMetadata, metadata
        );
    }

    public error(messageOrLog: string | IApiLog, detailsOrMetadata?: Nilable<string | ApiLogMetadata>, metadata?: Nilable<ApiLogMetadata>): void {
        return this.#executeAction(
            this.logger.error,
            messageOrLog, detailsOrMetadata, metadata
        );
    }

    public info(messageOrLog: string | IApiLog, detailsOrMetadata?: Nilable<string | ApiLogMetadata>, metadata?: Nilable<ApiLogMetadata>): void {
        return this.#executeAction(
            this.logger.info,
            messageOrLog, detailsOrMetadata, metadata
        );
    }

    public trace(messageOrLog: string | IApiLog, detailsOrMetadata?: Nilable<string | ApiLogMetadata>, metadata?: Nilable<ApiLogMetadata>): void {
        return this.#executeAction(
            this.logger.trace,
            messageOrLog, detailsOrMetadata, metadata
        );
    }

    public warn(messageOrLog: string | IApiLog, detailsOrMetadata?: Nilable<string | ApiLogMetadata>, metadata?: Nilable<ApiLogMetadata>): void {
        return this.#executeAction(
            this.logger.warn,
            messageOrLog, detailsOrMetadata, metadata
        );
    }
}

/**
 * Creates a new instance of an `IApiLogger` object.
 *
 * @param {ILogger} [logger] The custom logger to use.
 *
 * @returns {IApiLogger} The new instance.
 */
export function createApiLogger(logger = log): IApiLogger {
    return new ApiLogger(logger);
}
