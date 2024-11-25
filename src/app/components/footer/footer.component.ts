import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    private auth: AuthService
  ) {}
  user: User | undefined | null;
  isAuthenticated = false;

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(
      value => (this.isAuthenticated = value)
    );
    this.auth.user$.subscribe(u => (this.user = u));
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: this.document.location.origin,
      },
    });
  }
}
