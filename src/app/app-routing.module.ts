import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { pathToFileURL } from 'url';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { LoginComponent } from './login/login.component';
import { NewuserComponent } from './newuser/newuser.component';

export const routes = [
  {path: "create-account", name: "Create Account", putInNavbar: true, authenticated: false, component: NewuserComponent},
  {path: "login", name: "Login", putInNavbar: true, authenticated: false, component: LoginComponent},
  {path: "authenticated", name: "Authenticated", putInNavbar: true, authenticated: true, component: AuthenticatedComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes.map(x => ({path: x.path, component: x.component})))],
  exports: [RouterModule]
})
export class AppRoutingModule { }
