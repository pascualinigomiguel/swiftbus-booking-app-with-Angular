import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div class="container">
        <a class="navbar-brand font-weight-bold fw-bold" routerLink="/">
          🚌 SwiftBus Booking
        </a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/search" routerLinkActive="active">Search Route</a>
          <a class="nav-link" routerLink="/buses" routerLinkActive="active">Bus List</a>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {}