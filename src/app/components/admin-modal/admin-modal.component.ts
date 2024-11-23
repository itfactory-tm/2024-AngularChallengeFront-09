import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { UserRequestDto } from '../../api/dtos/User/user-request-dto';
import { UserService } from '../../api/services/Users/user.service';
import { UserResponseDto } from '../../api/dtos/User/user-response-dto';
import { AuthService } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.css',
})
export class AdminModalComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    private renderer: Renderer2,
    private userService: UserService
  ) {}
  isVisible = false;
  user?: UserResponseDto;
  userId?: string;
  @Output() userUpdated = new EventEmitter<void>(); // Emit an event when a user is updated
  @Output() userUpdateFailed = new EventEmitter<void>(); // Emit an event when a user is updated

  public close() {
    this.isVisible = false;
    this.renderer.removeClass(document.body, 'overflow-hidden'); // Unlock scrolling when modal is open
    this.user = undefined;
    this.userId = '';
  }
  public show(user: UserResponseDto) {
    this.user = user;
    this.isVisible = true;
    this.renderer.addClass(document.body, 'overflow-hidden'); // Lock scrolling when modal is open
  }

  public submitUserForm() {
    this.auth.user$.subscribe(u => {
      if (this.user && u != null && u.sub) {
        const userRequestDto: UserRequestDto = {
          isAdmin: this.user.isAdmin,
          email: this.user.email,
          auth0Id: u.sub,
        };
        this.userService.updateUser(this.user.id, userRequestDto).subscribe({
          next: () => {
            this.userUpdated.emit(); // Notify parent component
            this.close();
          },
          error: err => {
            console.error('Error updating user:', err); // Log the error
            this.close();
            this.userUpdateFailed.emit(); // Notify parent component
          },
        });
      }
    });
  }
}
