import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { createUser } from 'src/utilities/api';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async onClickSubmit(): Promise<void> {
    const res = await createUser(this.username, this.firstName, this.lastName, this.emailAddress, this.password);
    if (res.status === 201) {
      this.router.navigate(["/Login"]);
    }
    else {
      console.log(res);
    }
  }

}
