import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.services';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="glass-card p-4 p-md-5">
      <!-- Header Badge Section -->
      <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-light-subtle">
        <div class="d-flex align-items-center">
          <div class="bg-primary bg-gradient text-white rounded-4 p-3 me-3 d-flex align-items-center justify-content-center shadow-sm" style="width: 56px; height: 56px;">
            <span class="fs-3">🚌</span>
          </div>
          <div>
            <h3 class="fw-bold mb-0 text-dark">Search Available Buses</h3>
            <p class="text-muted small mb-0">Find and reserve your preferred seats in seconds</p>
          </div>
        </div>

        <span class="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill d-none d-sm-inline-block">
          ⚡ Instant Confirmation
        </span>
      </div>

      <!-- Search Form -->
      <form (ngSubmit)="onSearch()">
        <div class="row g-3 align-items-end">
          
          <!-- From Location -->
          <div class="col-md-5 position-relative">
            <label class="form-label fw-bold text-secondary fs-7 text-uppercase tracking-wider">From</label>
            <select class="form-select" [(ngModel)]="from" name="from" required>
              @for (loc of locations; track loc) {
                <option [value]="loc">{{ loc }}</option>
              }
            </select>
          </div>

          <!-- Swap Icon (Desktop helper) -->
          <div class="col-md-2 d-none d-md-flex justify-content-center pb-2">
            <button type="button" class="btn-swap" (click)="swapLocations()" title="Swap Departure and Destination">
              ⇄
            </button>
          </div>

          <!-- To Location -->
          <div class="col-md-5">
            <label class="form-label fw-bold text-secondary fs-7 text-uppercase tracking-wider">To</label>
            <select class="form-select" [(ngModel)]="to" name="to" required>
              @for (loc of locations; track loc) {
                <option [value]="loc">{{ loc }}</option>
              }
            </select>
          </div>

          <!-- Date Selector -->
          <div class="col-md-7">
            <label class="form-label fw-bold text-secondary fs-7 text-uppercase tracking-wider">Travel Date</label>
            <input type="date" class="form-control" [(ngModel)]="date" name="date" required />
          </div>

          <!-- Search Button -->
          <div class="col-md-5 text-end">
            <button type="submit" class="btn btn-primary-custom w-100 py-3">
              Search Routes →
            </button>
          </div>

        </div>
      </form>
    </div>
  `
})
export class SearchFormComponent {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  locations = ['New York', 'Boston', 'Washington', 'Chicago'];
  from = 'New York';
  to = 'Boston';
  date = new Date().toISOString().split('T')[0];

  swapLocations() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }

  onSearch() {
    this.bookingService.setSearchCriteria({
      from: this.from,
      to: this.to,
      date: this.date
    });
    this.router.navigate(['/buses']);
  }
}