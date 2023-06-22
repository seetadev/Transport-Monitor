/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'stackdriver-errors-js' {
  class StackdriverErrorReporterOptions {
    /**
     *  the context in which the error occurred.
     */
    context?: {
      /**
       * the user who caused or was affected by the error.
       */
      user?: string;
    };
    /**
     * The API key to use to call the API.
     */
    key?: string;
    /**
     * the Google Cloud Platform project ID to report errors to.
     */
    targetUrl?: string;
    /**
     * Custom function to be called with the error payload for reporting, instead of HTTP request. The function should return a Promise.
     */
    customReportingFunction?: Function;
    /**
     * The Google Cloud Platform project ID to report errors to.
     */
    projectId?: string;
    /**
     * Version identifier.
     */
    version?: string;
    /**
     * Service identifier.
     */
    service?: string;
    /**
     * Set to false to stop reporting unhandled exceptions.
     */
    reportUncaughtExceptions?: boolean;
    /**
     * Set to true to not report errors when calling report(), this can be used when developping locally.
     */
    disabled?: boolean;
  }

  class ReportOptions {
    /**
     * Omit number of frames if creating stack.
     */
    skipLocalFrames: number;
  }

  /**
   * An Error handler that sends errors to the Stackdriver Error Reporting API.
   */
  export default class StackdriverErrorReporter {
    /**
     * Initialize the StackdriverErrorReporter object.
     * @param  config - the init configuration.
     */
    start(config: StackdriverErrorReporterOptions): void;

    /**
     * Report an error to the Stackdriver Error Reporting API
     * @param err - The Error object or message string to report.
     * @param options - Configuration for this report.
     * @returns A promise that completes when the report has been sent.
     */
    report(
      err: Error | string,
      options?: ReportOptions
    ): Promise<{ message: string }>;
    /**
     * Set the user for the current context.
     *
     * @param user - the unique identifier of the user (can be ID, email or custom token) or `undefined` if not logged in.
     */
    setUser(user: string): void;
  }
}
