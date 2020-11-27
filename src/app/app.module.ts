import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { NewuserComponent } from './newuser/newuser.component';
import { FormsModule } from '@angular/forms';
import { LinkComponent } from './navbar/link/link.component';
import { DialogComponent } from './dialog/dialog.component';
import { PostComponent } from './post-container/post/post.component';
import { PostContainerComponent } from './post-container/post-container.component';
import { DeleteButtonComponent } from './post-container/post/delete-button/delete-button.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    AuthenticatedComponent,
    NewuserComponent,
    LinkComponent,
    DialogComponent,
    PostComponent,
    PostContainerComponent,
    DeleteButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
