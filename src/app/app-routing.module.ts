import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewuserComponent } from './newuser/newuser.component';
import { PostContainerComponent } from './post-container/post-container.component';
import { AuthService } from './services/auth.service';

export const routes = [
  { path: "create-account", name: "Create Account", putInNavbar: true, component: NewuserComponent },
  { path: "login", name: "Login", putInNavbar: true, component: LoginComponent },
  { path: "authenticated", name: "Authenticated", putInNavbar: false, canActivate: [AuthService], component: PostContainerComponent },
  { path: "posts", name: "Posts", putInNavbar: true, component: PostContainerComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(
    [
      ...routes.map(x => ({ path: x.path, component: x.component, canActivate: x.canActivate })),
      { path: "", redirectTo: "posts", pathMatch: "full" }
    ]
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
