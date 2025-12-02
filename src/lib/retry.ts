/**
 * Retry Utility for Failed Operations
 *
 * Provides automatic retry logic with exponential backoff for failed operations.
 * Useful for network requests, API calls, and other unreliable operations.
 */

export interface RetryOptions {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxAttempts?: number;

  /**
   * Initial delay in milliseconds before first retry
   * @default 1000
   */
  initialDelay?: number;

  /**
   * Maximum delay in milliseconds between retries
   * @default 10000
   */
  maxDelay?: number;

  /**
   * Multiplier for exponential backoff
   * @default 2
   */
  backoffMultiplier?: number;

  /**
   * Function to determine if error should trigger retry
   * @default () => true
   */
  shouldRetry?: (error: Error, attempt: number) => boolean;

  /**
   * Callback called before each retry attempt
   */
  onRetry?: (error: Error, attempt: number, nextDelay: number) => void;
}

/**
 * Retry a function with exponential backoff
 *
 * @example
 * const data = await retryAsync(
 *   () => fetch('/api/data').then(r => r.json()),
 *   {
 *     maxAttempts: 3,
 *     initialDelay: 1000,
 *     onRetry: (error, attempt, delay) => {
 *       console.log(`Retry ${attempt} after ${delay}ms: ${error.message}`);
 *     }
 *   }
 * );
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
    onRetry,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Check if we should retry this error
      if (!shouldRetry(lastError, attempt)) {
        throw lastError;
      }

      // Calculate next delay with exponential backoff
      const currentDelay = Math.min(delay, maxDelay);

      // Call onRetry callback if provided
      onRetry?.(lastError, attempt, currentDelay);

      // Wait before retrying
      await sleep(currentDelay);

      // Increase delay for next attempt
      delay *= backoffMultiplier;
    }
  }

  throw lastError!;
}

/**
 * Retry with specific error types
 *
 * @example
 * const data = await retryWithFilter(
 *   () => apiCall(),
 *   {
 *     retryOn: [NetworkError, TimeoutError],
 *     maxAttempts: 5
 *   }
 * );
 */
export async function retryWithFilter<T>(
  fn: () => Promise<T>,
  options: RetryOptions & {
    retryOn?: Array<new (...args: any[]) => Error>;
  }
): Promise<T> {
  const { retryOn, ...retryOptions } = options;

  return retryAsync(fn, {
    ...retryOptions,
    shouldRetry: (error) => {
      if (!retryOn || retryOn.length === 0) {
        return true;
      }
      return retryOn.some((ErrorType) => error instanceof ErrorType);
    },
  });
}

/**
 * Retry fetch requests with automatic parsing
 *
 * @example
 * const data = await retryFetch('/api/data', {
 *   method: 'GET',
 * }, {
 *   maxAttempts: 3,
 *   initialDelay: 2000
 * });
 */
export async function retryFetch<T = any>(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<T> {
  return retryAsync(
    async () => {
      const response = await fetch(url, init);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Try to parse as JSON
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json() as Promise<T>;
      }

      // Return text for non-JSON responses
      return response.text() as any;
    },
    {
      ...options,
      shouldRetry: (error, attempt) => {
        // Don't retry on 4xx errors (client errors)
        if (error.message.match(/HTTP 4\d{2}/)) {
          return false;
        }

        // Retry on network errors and 5xx errors
        if (options.shouldRetry) {
          return options.shouldRetry(error, attempt);
        }

        return true;
      },
    }
  );
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Common network error types
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Retry with timeout
 *
 * @example
 * const data = await retryWithTimeout(
 *   () => slowApiCall(),
 *   5000, // 5 second timeout
 *   { maxAttempts: 3 }
 * );
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  options: RetryOptions = {}
): Promise<T> {
  return retryAsync(async () => {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`)),
          timeoutMs
        )
      ),
    ]);
  }, options);
}
