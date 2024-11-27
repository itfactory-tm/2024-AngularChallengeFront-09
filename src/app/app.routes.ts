import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LineUpComponent } from './pages/line-up/line-up.component';
import { StagesComponent } from './pages/stages/stages.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent } from './pages/admin/admin.component';
import { StageInfoComponent } from './pages/stage-info/stage-info.component';
import { ArtistCrudComponent } from './pages/artist-crud/artist-crud.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { PerformanceCrudComponent } from './pages/performance-crud/performance-crud.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'line-up', component: LineUpComponent },
  { path: 'stages', component: StagesComponent },
  { path: 'stages/:slug', component: StageInfoComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'manage-artists', component: ArtistCrudComponent, canActivate: [AuthGuard]},
  //{ path: 'manage-performances', component: PerformanceCrudComponent, canActivate: [AuthGuard]},
  { path: 'manage-performances', component: PerformanceCrudComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: '**', component: ErrorPageComponent }, // Fallback
];
