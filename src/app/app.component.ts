import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './login/login-button';
import { LogoutButtonComponent } from './login/logout-button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginButtonComponent, LogoutButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
}
