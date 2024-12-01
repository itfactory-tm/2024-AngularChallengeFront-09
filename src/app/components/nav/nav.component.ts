import { Component, HostListener, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  constructor(private renderer: Renderer2) {}
  isScrolled = false;
  dropdownIsVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }
  showDropdown() {
    this.renderer.addClass(document.body, 'overflow-hidden'); // Lock scrolling when modal is open
    this.dropdownIsVisible = true;
  }
  closeDropdown() {
    this.renderer.removeClass(document.body, 'overflow-hidden'); // Unlock scrolling when modal is open
    this.dropdownIsVisible = false;
  }
}
