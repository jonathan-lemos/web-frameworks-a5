import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  username: string = ""
  password: string = ""

  error: string = "";

  constructor(private auth: AuthService, private router: Router, private av: ActivatedRoute) { }

  ngOnInit(): void {
    this.username = this.av.snapshot.queryParamMap.get("username") ?? "";
  }

  async onClickSubmit(): Promise<void> {
    const res = await this.auth.authenticate(this.username, this.password);
    if (res.isSuccess()) {
      this.router.navigate(["authenticated"]);
    }
    else {
      this.error = res.toString();
    }
  }
}
