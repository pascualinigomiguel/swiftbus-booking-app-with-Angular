import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from '../core/bus.service';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  template: `
    <div class="container py-4">
      <h3>Select Seats</h3>
      @if (!busId()) {
        <p>Bus ID is missing or invalid. Please go back to <a routerLink="/buses">Available Buses</a>.</p>
      } @else {
        <p>Loading seats for bus <strong>{{ busId() }}</strong>...</p>
      }
    </div>
  `
})
export class SeatSelectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private busService = inject(BusService);

  busId = signal<string | null>(null);

  ngOnInit(): void {
    // Read route parameter dynamically
    this.route.paramMap.subscribe(params => {
      const id = params.get('busId');
      if (id) {
        this.busId.set(id);
        this.loadSeatLayout(id);
      }
    });
  }

  private loadSeatLayout(busId: string): void {
    this.busService.getSeatsByBusId(busId).subscribe();
  }
}