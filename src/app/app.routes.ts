import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';

export const routes: Routes = [
    /* { path: '', redirectTo: 'login', pathMatch: 'full' }, */
    { path: 'home', component: Dashboard },
    /* { path: 'login', component: LoginComponent },
    { path: 'home', component: DashboardComponent, canActivate: [AuthGuard]}, */
];
