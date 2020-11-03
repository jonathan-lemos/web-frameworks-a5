import { EventEmitter, Injectable } from '@angular/core';
import { CanActivate, NavigationStart, Router } from '@angular/router';
import { Result } from '../functional/result';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  _emitter = new EventEmitter<"Login" | "Logout">();

  subscribe(fn: (event: "Login" | "Logout") => void) {
    this._emitter.subscribe(fn);
  }

  constructor(private api: ApiService, private router: Router) {
    api.unauthorizedSubscribe(() => {
      if (this.isAuthenticated()) {
        this.logout();
      }
    });
  }

  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    return window.localStorage.getItem("Auth") != null;
  }

  auth(): string | null {
    return window.localStorage.getItem("Auth");
  }

  logout(): void {
    window.localStorage.removeItem("Auth");
    document.cookie = "X-Auth-Token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    this._emitter.emit("Logout");
    this.router.navigate(["login"]);
  }

  async authenticate(userId: string, password: string): Promise<Result<string, string>> {
    const res = await this.api.authenticateUser(userId, password);
    if (res.isSuccess()) {
      window.localStorage.setItem("Auth", res.value);
      this._emitter.emit("Login");
    }
    return res;
  }
}
