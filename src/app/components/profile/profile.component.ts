import { Component } from '@angular/core';
import { UserProfileComponent } from '../../components/login/user-profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserProfileComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent {
}
