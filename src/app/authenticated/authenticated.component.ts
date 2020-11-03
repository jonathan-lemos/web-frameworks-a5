import { Component, OnInit } from '@angular/core';
import { Result } from '../functional/result';
import { ApiService } from '../services/api.service';
import { User } from '../services/apiClasses/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.sass']
})
export class AuthenticatedComponent implements OnInit {
  users: Result<User[], string>;

  constructor(private api: ApiService, private auth: AuthService) {

  }

  async ngOnInit(): Promise<void> {
    if (!this.auth.auth()) {
      this.auth.logout();
    }
    this.users = await this.api.queryUsers(this.auth.auth());
    console.log(this.users);
  }

}
