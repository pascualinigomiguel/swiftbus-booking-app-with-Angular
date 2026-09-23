import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../services/booking.services';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  template: `
    <div class="container">
      <h4 class="mb-3">Available Bus Routes</h4>

      @for (bus of bookingService.availableBuses(); track bus.id) {
        <div class="card mb-3 shadow-sm border-0">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-4">
                <h5 class="card-title text-primary mb-1">{{ bus.name }}</h5>
                <span class="badge bg-secondary mb-2">{{ bus.type }}</span>
                <p class="text-muted mb-0">{{ bus.origin }} ➔ {{ bus.destination }}</p>
              </div>

              <div class="col-md-4">
                <p class="mb-1">Departure: <strong>{{ bus.departureTime }}</strong></p>
                <p class="mb-0">Arrival: <strong>{{ bus.arrivalTime }}</strong></p>
              </div>

              <div class="col-md-4 text-end">
                <h4 class="text-success fw-bold me-2 d-inline">{{ bus.basePrice | currency }}</h4>
                <button class="btn btn-outline-primary" (click)="bookingService.selectBus(bus)">
                  {{ bookingService.selectedBus()?.id === bus.id ? 'Selected' : 'Select Seat' }}
                </button>
              </div>
            </div>

            <!-- Seat Picker Accordion -->
            @if (bookingService.selectedBus()?.id === bus.id) {
              <div class="mt-4 p-3 bg-light rounded border">
                <h6>Select Seats for {{ bus.name }}</h6>
                
                <div class="row justify-content-center my-3">
                  <div class="col-auto">
                    <div class="d-flex flex-wrap gap-2" style="max-width: 260px;">
                      @for (seat of bus.seats; track seat.id) {
                        <button
                          type="button"
                          class="btn btn-sm"
                          [class.btn-secondary]="seat.isBooked"
                          [class.btn-primary]="bookingService.selectedSeatIds().includes(seat.id)"
                          [class.btn-outline-primary]="!seat.isBooked && !bookingService.selectedSeatIds().includes(seat.id)"
                          [disabled]="seat.isBooked"
                          (click)="bookingService.toggleSeat(seat.id)">
                          {{ seat.number }}
                        </button>
                      }
                    </div>
                  </div>
                </div>

                @if (bookingService.selectedSeatIds().length > 0) {
                  <div class="border-top pt-3 mt-3">
                    <div class="row align-items-center">
                      <div class="col-md-6">
                        <p class="mb-0">Selected Seats: <strong>{{ getSelectedSeatsText() }}</strong></p>
                        <p class="mb-0">Total Fare: <strong class="text-success">{{ bookingService.totalPrice() | currency }}</strong></p>
                      </div>
                      <div class="col-md-6 text-end">
                        <button class="btn btn-success" (click)="confirmBooking()">Book Selected Tickets</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      } @empty {
        <div class="alert alert-warning">
          No buses found for this search. Please go back to <a routerLink="/search">Search Route</a>.
        </div>
      }
    </div>
  `
})
export class BusListComponent {
  public bookingService = inject(BookingService);

  getSelectedSeatsText(): string {
    return this.bookingService.selectedSeats().map(s => s.number).join(', ');
  }

  confirmBooking() {
    alert(`Booking confirmed for seats: ${this.getSelectedSeatsText()}`);
    this.bookingService.clearBooking();
  }
}