import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LineUpComponent } from './pages/line-up/line-up.component';
import { StagesComponent } from './pages/stages/stages.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent } from './pages/admin/admin.component';
import { StageInfoComponent } from './pages/stage-info/stage-info.component';
import { ArtistCrudComponent } from './pages/admin/artist-crud/artist-crud.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { StageCrudComponent } from './pages/admin/stage-crud/stage-crud.component';
import { PerformanceCrudComponent } from './pages/admin/performance-crud/performance-crud.component';
import { GenreCrudComponent } from './pages/admin/genre-crud/genre-crud.component';
import { TicketCrudComponent } from './pages/admin/ticket-crud/ticket-crud.component';


export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'line-up', component: LineUpComponent },
  { path: 'stages', component: StagesComponent },
  { path: 'stages/:slug', component: StageInfoComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin/manage-artists', component: ArtistCrudComponent, canActivate: [AuthGuard]},
  { path: 'admin/manage-stages', component: StageCrudComponent, canActivate: [AuthGuard]},
  { path: 'admin/manage-genres', component: GenreCrudComponent, canActivate: [AuthGuard]},
  { path: 'admin/manage-tickets', component: TicketCrudComponent, canActivate: [AuthGuard]},
  { path: 'admin/manage-performances', component: PerformanceCrudComponent, canActivate: [AuthGuard]},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: '**', component: ErrorPageComponent },
];