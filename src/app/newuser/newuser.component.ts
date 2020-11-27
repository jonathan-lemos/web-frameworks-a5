import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.sass']
})
export class NewuserComponent implements OnInit {
  username: string = "";
  firstName: string = "";
  lastName: string = "";
  emailAddress: string = "";
  password: string = "";

  error: string = "";

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  async onClickSubmit(): Promise<void> {
    const res = await this.api.createUser(this.username, this.firstName, this.lastName, this.emailAddress, this.password);
    if (res.isSuccess()) {
      this.router.navigate(["/login"], { queryParams: { username: res.value.userId } });
    }
    else {
      this.error = res.toString();
    }
  }

  async onKeyUp(e: any): Promise<void> {
    if (e.key === "Enter") {
      await this.onClickSubmit();
    }
  }
}
