import { Component, ViewChild } from '@angular/core';
import { AdminButtonComponent } from '../../components/admin/admin-button/admin-button.component';
import { AuthService, User } from '@auth0/auth0-angular';
import { OnInit } from '@angular/core';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    AdminButtonComponent,
    ErrorToastComponent,
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;

  user: User | undefined | null;
  token!: string;
  constructor(
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(e => {
      this.user = e;
    });
    this.auth.getAccessTokenSilently().subscribe({
      next: token => {
        this.token = token;
      },
      error: err => {
        console.error('Error getting access token:', err);
      },
    });
  }

  notifyFail(): void {
    this.errorToast.showToast();
  }
}
