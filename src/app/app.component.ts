import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';

import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from './components/loading-spinner/spinner/spinner.component';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from './api/services/Users/user.service';
import { LoaderService } from './components/loading-spinner/loader.service';
import { AdminNavComponent } from "./components/admin/admin-nav/admin-nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    FooterComponent,
    SpinnerComponent,
    AdminNavComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = '2024-AngularChallengeFront-09';
  isAdminPage: boolean = false;

  // Redirect to url after login auth0...
  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService
  ) {
    // Show spinner also for authentication
    this.auth.isLoading$.subscribe(isLoading => {
      if (isLoading) {
        this.loaderService.setLoading(true);
      } else {
        this.loaderService.setLoading(false);
      }
    });

    this.auth.appState$.subscribe(appState => {
      if (appState && appState.target) {
        if (
          this.auth.isAuthenticated$.subscribe(isAuthenticated => {
            if (isAuthenticated) {
              // Add user to backend or update it or nothing
              this.userService.syncUser().subscribe({
                next: response =>
                  console.log('User synced successfully:', response),
                error: err => console.error('Error syncing user:', err),
              });
            }
          })
        )
          this.router.navigate([appState.target]); // Redirect to the target URL
      }
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isAdminPage = this.router.url.includes('/admin');
    });
  }
}
