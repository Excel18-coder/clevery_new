import axios, { AxiosError } from "axios";

/**
 * Handles API errors and returns a more informative error message
 * @param error - The error object from the API call
 * @param defaultMessage - A default message to use if a more specific one can't be determined
 * @returns An Error object with a descriptive message
 */
export function handleApiError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response) {
      return new Error(axiosError.response.data.message || `${defaultMessage}: ${axiosError.response.status}`);
    } else if (axiosError.request) {
      return new Error(`${defaultMessage}: No response received`);
    }
  }
  return new Error(defaultMessage);
}