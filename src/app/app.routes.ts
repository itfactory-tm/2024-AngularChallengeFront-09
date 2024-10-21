import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '@auth0/auth0-angular';

import { HomePageComponent } from './home-page/home-page.component';
import { LineUpComponent } from './line-up/line-up.component';
import { StagesComponent } from './stages/stages.component';
import { TicketsComponent } from './tickets/tickets.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    {path:'', component:HomePageComponent},
    {path:'line-up', component:LineUpComponent},
    {path:'stages', component:StagesComponent},
    {path:'tickets', component:TicketsComponent},
    {path:'contact', component:ContactComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
];
