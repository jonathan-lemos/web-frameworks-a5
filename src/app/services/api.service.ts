import { EventEmitter, Injectable } from '@angular/core';
import { Runtype } from 'runtypes';
import { environment } from '../../environments/environment';
import { Failure, Result, Success } from '../functional/result';
import { User } from './apiClasses/user';

type ApiResponse = {type: "no response", reason: string} |
{type: "json response", status: number, response: any} |
{type: "non json response", status: number, response: string};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.server.replace(/\/+$/, "");

  private unauthorizedListeners: (() => void)[] = []

  constructor() { }

  unauthorizedSubscribe(fn: () => void) {
    this.unauthorizedListeners.push(fn);
  }

  private emitUnauthorized() {
    this.unauthorizedListeners.forEach(x => x());
  }

  private ajax(method: string) {
    return async (url: string, auth?: string): Promise<ApiResponse> => {
      url = `${this.baseUrl}/${url.replace(/^\/+/, "")}`
      try {
        const res1 = await fetch(url, {
          method: method,
          credentials: "include",
          headers: {
            "Authorization": auth ? `Bearer ${auth}` : undefined
          }
        });

        if (res1.status === 401) {
          this.emitUnauthorized();
        }

        const text = await res1.text();
        try {
          const res2 = JSON.parse(text);
          return {type: "json response", status: res1.status, response: res2};
        }
        catch (e) {
          return {type: "non json response", status: res1.status, response: text};
        }
      }
      catch (e) {
        return {type: "no response", reason: e.message ?? e};
      }
    }
  }

  private ajaxBody(method: string) {
    return async (url: string, body: any, auth?: string): Promise<ApiResponse> => {
      url = `${this.baseUrl}/${url.replace(/^\/+/, "")}`
      try {
        const res1 = await fetch(url, {
          method: method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": auth ? `Bearer ${auth}` : undefined
          },
          body: JSON.stringify(body)
        });

        if (res1.status === 401) {
          this.emitUnauthorized();
        }

        const text = await res1.text();
        try {
          const res2 = JSON.parse(text);
          return {type: "json response", status: res1.status, response: res2};
        }
        catch (e) {
          return {type: "non json response", status: res1.status, response: text};
        }
      }
      catch (e) {
        return {type: "no response", reason: e.message ?? e};
      }
    }
  }

  readonly get = this.ajax("GET");
  readonly del = this.ajax("DELETE");
  readonly post = this.ajaxBody("POST");
  readonly patch = this.ajaxBody("PATCH");

  async createUser(userId: string, firstName: string, lastName: string, emailAddress: string, password: string): Promise<Result<User, string>> {
    const res = await this.post("/Users", { userId, firstName, lastName, emailAddress, password });
    if (!(res.type === "json response")) {
      return new Failure(JSON.stringify({...res, error: "Expected a JSON response"}, null, 2));
    }

    if (Math.floor(res.status / 100) !== 2) {
      return new Failure(JSON.stringify({...res, error: "Response status was not 2XX."}, null, 2));
    }

    try {
      return new Success(User.check(res.response));
    }
    catch (e) {
      return new Failure(JSON.stringify({...res, error: `The given object was not a User: ${e.message ?? e}`}, null, 2));
    }
  }

  async queryUser(userId: string, auth: string): Promise<Result<User, string>> {
    if (userId.trim().length === 0) {
      return new Failure("userId must be specified.");
    }

    const res = await this.get(`/Users/${userId}`, auth);
    if (!(res.type === "json response")) {
      return new Failure(JSON.stringify({...res, error: "Expected a JSON response"}, null, 2));
    }

    if (Math.floor(res.status / 100) !== 2) {
      return new Failure(JSON.stringify({...res, error: "Response status was not 2XX."}, null, 2));
    }

    try {
      return new Success(User.check(res.response));
    }
    catch (e) {
      return new Failure(JSON.stringify({...res, error: `The given object was not a User: ${e.message ?? e}`}, null, 2));
    }
  }

  async queryUsers(auth: string): Promise<Result<User[], string>> {
    const res = await this.get(`/Users`, auth);

    if (!(res.type === "json response")) {
      return new Failure(JSON.stringify({...res, error: "Expected a JSON response"}, null, 2));
    }

    if (Math.floor(res.status / 100) !== 2) {
      return new Failure(JSON.stringify({...res, error: "Response status was not 2XX."}, null, 2));
    }

    if (!Array.isArray(res.response)) {
      return new Failure(JSON.stringify({...res, error: "Expected an array of users"}, null, 2));
    }

    const ret: User[] = [];

    for (const obj of res.response) {
      try {
        ret.push(User.check(obj));
      }
      catch (e) {
        return new Failure(JSON.stringify({...res, error: `One or more of the returned objects was not a User: ${e.message ?? e}`, badObject: obj}, null, 2));
      }
    }

    return new Success(ret);
  }

  async updateUser(userId: string, update: Partial<{ firstName: string, lastName: string, emailAddress: string, password: string }>, auth: string): Promise<Result<any, string>> {
    const res = await this.patch("/Users", { ...update, userId }, auth);

    if (!(res.type === "json response")) {
      return new Failure(JSON.stringify({...res, error: "Expected a JSON response"}, null, 2));
    }

    if (Math.floor(res.status / 100) !== 2) {
      return new Failure(JSON.stringify({...res, error: "Response status was not 2XX."}, null, 2));
    }

    return new Success(res.response);
  }

  async deleteUser(userId: string, auth: string): Promise<Result<any, string>> {
    if (userId.trim().length === 0) {
      return new Failure("userId must be specified.");
    }

    const res = await this.del(`/Users/${userId}`, auth);

    if (!(res.type === "json response")) {
      return new Failure(JSON.stringify({...res, error: "Expected a JSON response"}, null, 2));
    }

    if (Math.floor(res.status / 100) !== 2) {
      return new Failure(JSON.stringify({...res, error: "Response status was not 2XX."}, null, 2));
    }

    return new Success(res.response);
  }

  async authenticateUser(userId: string, password: string): Promise<Result<string, string>> {
    if (userId.trim().length === 0 || password.trim().length === 0) {
      return new Failure("userId and password must be specified.");
    }

    const res = await this.get(`/Users/${userId}/${password}`);

    if (!(res.type === "json response")) {
      return new Failure(JSON.stringify({...res, error: "Expected a JSON response"}, null, 2));
    }

    if (Math.floor(res.status / 100) !== 2) {
      return new Failure(JSON.stringify({...res, error: "Response status was not 2XX."}, null, 2));
    }

    if (typeof res.response.token !== "string") {
      return new Failure(JSON.stringify({...res, error: res.response.token == null ? "No 'token' in response." : "'token' in response was not a string."}, null, 2));
    }

    return new Success(res.response.token as string);
  };
}
