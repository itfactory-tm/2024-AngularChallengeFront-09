import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';

import { LoginButtonComponent } from './login/login-button';
import { LogoutButtonComponent } from './login/logout-button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, LoginButtonComponent, LogoutButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
}
