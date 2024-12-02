import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-button.component.html',
  styleUrl: './admin-button.component.css',
})
export class AdminButtonComponent {
  @Input()
  text!: string;
  @Input()
  icon_classes!: string;
  @Input()
  destination!: string;
}
