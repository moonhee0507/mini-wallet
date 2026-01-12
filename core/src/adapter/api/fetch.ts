import axios, { AxiosRequestConfig } from "axios";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | number | boolean>;
};

export async function fetch<TResponse>(
  baseUrl: string,
  path: string,
  options: FetchOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, query, headers } = options;

  const config: AxiosRequestConfig = {
    url: `${baseUrl}${path}`,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    params: query,
    data: body,
  };

  try {
    const response = await axios<TResponse>(config);
    return response.data;
  } catch (error: any) {
    /**
     * axios 에러 형태:
     * error.response?.data
     * error.response?.status
     */
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
}