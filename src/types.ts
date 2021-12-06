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

/**
 * Options for 'useApiLogger()' function.
 */
export interface IUseApiLoggerOptions {
    /**
     * The url pointing to the logs service.
     * Optional. If the url is not provided, environment variable LOGS_SERVICE_URL will be used.
     */
    url?: string;

    /**
     * The api key for the logs service.
     * Optional. If the key is not provided, environment variable LOGS_SERVICE_KEY will be used.
     */
    key?: string;

    /**
     * The client id for the logs service.
     * Optional. If the key is not provided, environment variable LOGS_SERVICE_CLIENT will be used.
     */
    client?: string;
}

/**
 * IApiLog interface defines required and optional fields for a log.
 */
export interface IApiLog {
    /**
     * environment prop represents the actual stage of the application.
     * will be overwritten by the package with environment variable i-e: ENVIRONMENT
     */
    environment?: 'dev' | 'test' | 'prod';
    /**
     * body prop represents additional information about request body.
     * Optional.
     */
    body?: any;
    /**
     * browser prop represents additional information about browser.
     * Optional.
     */
    browser?: any;
    /**
     * cookies prop represents the cookies.
     * Optional.
     */
    cookies?: any;
    /**
     * headers prop represents additional information about request headers.
     * Optional.
     */
    headers?: any;
    /**
     * os prop represents additional information about operating system on which application is running.
     * Optional.
     */
    os?: any;
    /**
     * runtime prop represents information about runtime systems such as version numbers.
     * Optional.
     */
    runtime?: any;
    /**
     * sdk prop represents additional information about the sdk on which application is built.
     * Optional.
     */
    sdk?: any;
    /**
     * message prop represents a high-level introduction of the log.
     * Required.
     */
    message: string;
    /**
     * details prop represents an in-depth summary of the log.
     * Required.
     */
    details: string;
    /**
     * severity prop represents how severe the log is.
     * will be overwritten by the method of the log.
     */
    severity?: 'error' | 'debug' | 'warning' | 'info';
    /**
     * metadata prop is a collection of objects to add extra information to the log.
     * Optional.
     */
    metadata?: { [name: string]: IApiLogMetadata };
}

/**
 * IApiLogMetadata defines structure of a metadata object.
 */
export interface IApiLogMetadata {
    /**
     * value prop represents the value of metadata object.
     */
    value: any;
}