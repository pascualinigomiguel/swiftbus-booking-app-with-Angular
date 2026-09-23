import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BusService } from '../core/bus.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="container">
      @if (busService.loading()) {
        <div class="spinner">Loading available routes...</div>
      }

      @if (busService.error()) {
        <div class="alert alert-danger">{{ busService.error() }}</div>
      }

      @for (bus of busService.buses(); track bus.id) {
        <div class="bus-card">
          <h3>{{ bus.name }}</h3>
          <p>{{ bus.origin }} ➔ {{ bus.destination }}</p>
          <p>Price: {{ bus.basePrice | currency }}</p>
          <button (click)="selectBus(bus.id)">Book Seats</button>
        </div>
      } @empty {
        @if (!busService.loading()) {
          <p>No buses found for this search route.</p>
        }
      }
    </div>
  `
})
export class BusListComponent {
  readonly busService = inject(BusService);
  private router = inject(Router);

  selectBus(busId: string): void {
    this.router.navigate(['/select-seats', busId]);
  }
}