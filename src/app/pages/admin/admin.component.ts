import { Component } from '@angular/core';
import { AdminButtonComponent } from '../../components/admin-button/admin-button.component';
import { AuthService, User } from '@auth0/auth0-angular';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../api/services/Users/user.service';
import { UserRequestDto } from '../../api/dtos/User/user-request-dto';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminButtonComponent, AsyncPipe, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  user: User | undefined | null;
  users$?: Observable<UserRequestDto[]>;
  constructor(public auth: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((e) => {
      this.user = e;
    })
    this.users$ = this.userService.getUsers();
  }
}
