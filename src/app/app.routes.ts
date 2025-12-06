import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/pages/login/login';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: Dashboard , canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
];
