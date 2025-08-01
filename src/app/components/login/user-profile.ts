import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [AsyncPipe, CommonModule],
  template: `
    <ul *ngIf="auth.user$ | async as user">
      <li>{{ user.name }}</li>
      <li>{{ user.email }}</li>
    </ul>`,
  standalone: true
})
export class UserProfileComponent {
  constructor(public auth: AuthService) {}
}
