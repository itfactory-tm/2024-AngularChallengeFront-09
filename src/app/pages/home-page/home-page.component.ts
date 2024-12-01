import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoginButtonComponent } from "../../components/login/login-button";
import { LogoutButtonComponent } from '../../components/login/logout-button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [LoginButtonComponent, LogoutButtonComponent, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})export class HomePageComponent {

	// This will be used to reference the next section
	@ViewChild('nextSection') nextSection!: ElementRef;

	// This method will be called on button click
	scrollToNextSection() {
	  this.nextSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
	}
}
