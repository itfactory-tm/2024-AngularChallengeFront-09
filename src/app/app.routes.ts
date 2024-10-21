import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
];
