import { type Env } from "./constants";
import { authApi, AuthApiKey } from "./auth";

/**
 * 모든 Service에서 사용하는 단일 fetch 함수
 */
export function dispatcher<
  K extends AuthApiKey,
  P extends Parameters<typeof authApi[K]>[1],
  R extends ReturnType<typeof authApi[K]>
>(
  env: Env,
  apiKey: K,
  params: P,
): R {
  const apiFn = authApi[apiKey];
  return apiFn(env, params) as R;
}