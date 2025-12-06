import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
