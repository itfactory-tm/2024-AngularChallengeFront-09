import { Component, ViewChild } from '@angular/core';
import { AdminButtonComponent } from '../../components/admin-button/admin-button.component';
import { AuthService, User } from '@auth0/auth0-angular';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../api/services/Users/user.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminModalComponent } from '../../components/admin-modal/admin-modal.component';
import { UserResponseDto } from '../../api/dtos/User/user-response-dto';
import { ErrorToastComponent } from '../../components/error-toast/error-toast.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    AdminButtonComponent,
    AsyncPipe,
    RouterLink,
    AdminModalComponent,
    ErrorToastComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  @ViewChild('userModal') userModal!: AdminModalComponent;
  @ViewChild('errorToast') errorToast!: ErrorToastComponent;

  user: User | undefined | null;
  token!: string;
  users$?: Observable<UserResponseDto[]>;
  constructor(
    public auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(e => {
      this.user = e;
    });
    this.users$ = this.userService.getUsers();
    this.auth.getAccessTokenSilently().subscribe({
      next: token => {
        this.token = token;
      },
      error: err => {
        console.error('Error getting access token:', err);
      },
    });
  }

  refreshUsers(): void {
    this.users$ = this.userService.getUsers();
  }

  notifyFail(): void {
    console.log('FAILED');
    this.errorToast.showToast();
  }
}
