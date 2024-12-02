import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  isVisible = false; // To manage toast visibility
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
