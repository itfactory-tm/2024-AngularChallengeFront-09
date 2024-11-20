import { Component } from '@angular/core';
import { AdminButtonComponent } from '../../components/admin-button/admin-button.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminButtonComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {}
