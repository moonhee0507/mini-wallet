import { dispatcher, type Env } from "./adapter/api";
import AuthenticateController from "./controller/authenticate";
import AuthenticateService from "./service/authenticate";

export type CoreControllers = {
  authenticate: AuthenticateController;
};

export type CoreServices = {
  authenticate: AuthenticateService;
};

export default class Core {
  public readonly controller: CoreControllers;
  public readonly service: CoreServices;

  constructor(private env: Env) {
    this.service = {
      authenticate: new AuthenticateService(env, this.fetch),
    };

    this.controller = {
      authenticate: new AuthenticateController(this),
    };
  }

  /**
   * Service에서 공통으로 사용하는 fetch
   */
  fetch = <
    K extends Parameters<typeof dispatcher>[1],
    P extends Parameters<typeof dispatcher>[2]
  >(
    apiKey: K,
    params: P,
  ) => dispatcher(this.env, apiKey, params);
}

export type { Env };