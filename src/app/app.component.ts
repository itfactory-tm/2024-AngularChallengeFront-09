import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';

import { Component } from '@angular/core';
import { LoginButtonComponent } from './components/login/login-button';
import { LogoutButtonComponent } from './components/login/logout-button';
import { SpinnerComponent } from './components/loading-spinner/spinner/spinner.component';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from './api/services/Users/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    FooterComponent,
    LoginButtonComponent,
    LogoutButtonComponent,
    SpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = '2024-AngularChallengeFront-09';

  // Redirect to url after login auth0...
  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.auth.appState$.subscribe(appState => {
      if (appState && appState.target) {
        // Add user to backend or update it or nothing
        this.userService.syncUser().subscribe({
          next: response => console.log('User synced successfully:', response),
          error: err => console.error('Error syncing user:', err),
        });
        this.router.navigate([appState.target]); // Redirect to the target URL
      }
    });
  }
}
