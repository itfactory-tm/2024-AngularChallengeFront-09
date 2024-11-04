import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';

import { Component } from '@angular/core';
import { LoginButtonComponent } from './components/login/login-button';
import { LogoutButtonComponent } from './components/login/logout-button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, LoginButtonComponent, LogoutButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

	title = '2024-AngularChallengeFront-09';

}
