import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { pathToFileURL } from 'url';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { LoginComponent } from './login/login.component';
import { NewuserComponent } from './newuser/newuser.component';
import { AuthService } from './services/auth.service';

export const routes = [
  { path: "create-account", name: "Create Account", putInNavbar: true, component: NewuserComponent },
  { path: "login", name: "Login", putInNavbar: true, component: LoginComponent },
  { path: "authenticated", name: "Authenticated", putInNavbar: true, canActivate: [AuthService], component: AuthenticatedComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(
    [
      ...routes.map(x => ({ path: x.path, component: x.component, canActivate: x.canActivate })),
      { path: "", redirectTo: "authenticated", pathMatch: "full" }
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
