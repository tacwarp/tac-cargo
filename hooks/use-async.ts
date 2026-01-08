/**
 * @fileoverview Async operation hooks
 * @module hooks/use-async
 *
 * Custom hooks for handling async operations with loading, error, and data states.
 */

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Async state interface
 */
export interface AsyncState<T> {
  /** Data returned from the async operation */
  data: T | null;
  /** Error if the operation failed */
  error: Error | null;
  /** Whether the operation is in progress */
  isLoading: boolean;
  /** Whether the operation has completed at least once */
  isSuccess: boolean;
  /** Whether the operation has failed */
  isError: boolean;
}

/**
 * Async operation options
 */
export interface UseAsyncOptions<T> {
  /** Initial data value */
  initialData?: T;
  /** Whether to execute immediately on mount */
  immediate?: boolean;
  /** Callback on success */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Hook for managing async operations.
 *
 * @param {() => Promise<T>} asyncFunction - The async function to execute
 * @param {UseAsyncOptions<T>} options - Hook options
 * @returns {AsyncState<T> & { execute: () => Promise<void>, reset: () => void }}
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, execute } = useAsync(
 *   () => fetch('/api/data').then(r => r.json()),
 *   { immediate: true }
 * )
 *
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error.message} />
 * return <DataDisplay data={data} />
 * ```
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {},
) {
  const { initialData, immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData ?? null,
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false,
  });

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Execute the async function
   */
  const execute = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: false,
    }));

    try {
      const result = await asyncFunction();

      if (isMounted.current) {
        setState({
          data: result,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
        onSuccess?.(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (isMounted.current) {
        setState({
          data: null,
          error,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
        onError?.(error);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  /**
   * Reset state to initial values
   */
  const reset = useCallback(() => {
    setState({
      data: initialData ?? null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, [initialData]);

  // Execute immediately if requested - using ref to avoid lint warning
  const immediateExecuted = useRef(false);

  useEffect(() => {
    if (immediate && !immediateExecuted.current) {
      immediateExecuted.current = true;
      // Defer execution to avoid setState in effect warning
      const timeoutId = setTimeout(() => {
        execute();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [immediate, execute]);

  return { ...state, execute, reset };
}

/**
 * Hook for fetching data with automatic refetching.
 *
 * @param {string} url - URL to fetch
 * @param {RequestInit} options - Fetch options
 * @returns {AsyncState<T> & { refetch: () => Promise<void> }}
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useFetch<User[]>('/api/users')
 * ```
 */
export function useFetch<T>(url: string, options?: RequestInit) {
  const fetchData = useCallback(async (): Promise<T> => {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [url, options]);

  const result = useAsync(fetchData, { immediate: true });

  return {
    ...result,
    refetch: result.execute,
  };
}

/**
 * Hook for debounced async operations.
 *
 * @param {(value: V) => Promise<T>} asyncFunction - Async function to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {AsyncState<T> & { execute: (value: V) => void }}
 *
 * @example
 * ```tsx
 * const { data, isLoading, execute } = useDebouncedAsync(
 *   (query: string) => searchApi(query),
 *   300
 * )
 *
 * <input onChange={(e) => execute(e.target.value)} />
 * ```
 */
export function useDebouncedAsync<T, V>(
  asyncFunction: (value: V) => Promise<T>,
  delay: number,
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const execute = useCallback(
    (value: V) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      timeoutRef.current = setTimeout(async () => {
        try {
          const result = await asyncFunction(value);

          if (isMounted.current) {
            setState({
              data: result,
              error: null,
              isLoading: false,
              isSuccess: true,
              isError: false,
            });
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));

          if (isMounted.current) {
            setState({
              data: null,
              error,
              isLoading: false,
              isSuccess: false,
              isError: true,
            });
          }
        }
      }, delay);
    },
    [asyncFunction, delay],
  );

  return { ...state, execute };
}

export default useAsync;
