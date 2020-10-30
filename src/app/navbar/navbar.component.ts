import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { routes } from '../app-routing.module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  links = routes.filter(x => x.putInNavbar);

  active: string;

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.active = this.router.url;

    this.router.events.subscribe(val => {
      if (!(val instanceof NavigationEnd)) {
        return;
      }
      this.active = val.urlAfterRedirects;
    });
  }
}
