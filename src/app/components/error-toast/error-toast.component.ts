import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.css',
})
export class ErrorToastComponent {
  isVisible = false;
  @Input()
  message = '';
  @Input()
  timeout = 3000;

  hideToast() {
    this.isVisible = false;
  }

  showToast() {
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
    }, this.timeout);
  }
}
