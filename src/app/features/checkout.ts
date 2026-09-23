import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../services/booking.services';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  template: `
    @if (bookingService.selectedSeatIds().length > 0) {
      <section class="checkout-card">
        <h3 class="card-title">Reservation Summary</h3>
        
        <div class="summary-details">
          <div class="row">
            <span>Bus:</span>
            <strong>{{ bookingService.selectedBus()?.name }}</strong>
          </div>
          <div class="row">
            <span>Seats:</span>
            <strong>{{ getSelectedSeatNumbers() }}</strong>
          </div>
          <div class="row total">
            <span>Total Payable:</span>
            <strong class="total-price">{{ bookingService.totalFare() | currency }}</strong>
          </div>
        </div>

        @if (!isConfirmed()) {
          <form [formGroup]="checkoutForm" (ngSubmit)="processBooking()" class="checkout-form">
            <div class="form-group">
              <label for="name">Passenger Name</label>
              <input id="name" type="text" formControlName="passengerName" placeholder="John Doe" />
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input id="email" type="email" formControlName="passengerEmail" placeholder="john@example.com" />
            </div>

            <button type="submit" [disabled]="checkoutForm.invalid" class="btn-confirm">
              Confirm & Pay
            </button>
          </form>
        } @else {
          <div class="ticket-receipt">
            <div class="receipt-header">🎉 Booking Confirmed</div>
            <p>Reference Code: <strong>{{ bookingReference() }}</strong></p>
            <p>Passenger: {{ checkoutForm.value.passengerName }}</p>
            <button class="btn-reset" (click)="resetAll()">Book Another Journey</button>
          </div>
        }
      </section>
    }
  `,
  styles: [`
    .checkout-card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      margin-top: 1.5rem;
    }
    .card-title { margin: 0 0 1rem 0; font-size: 1.2rem; }
    .summary-details { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
    .row { display: flex; justify-content: space-between; font-size: 0.95rem; }
    .row.total { font-size: 1.1rem; border-top: 1px solid var(--border); padding-top: 0.5rem; margin-top: 0.5rem; }
    .total-price { color: var(--success); }
    .checkout-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
    input { padding: 0.65rem 0.85rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.95rem; }
    .btn-confirm { background: var(--success); color: white; border: none; padding: 0.75rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }
    .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
    .ticket-receipt { background: #f0fdf4; border: 1px dashed var(--success); padding: 1.25rem; border-radius: var(--radius-md); text-align: center; }
    .receipt-header { font-weight: 700; color: var(--success); margin-bottom: 0.5rem; }
    .btn-reset { background: var(--text-muted); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--radius-md); cursor: pointer; margin-top: 0.75rem; }
  `]
})
export class CheckoutComponent {
  readonly bookingService = inject(BookingService);
  private fb = inject(FormBuilder);

  readonly isConfirmed = signal(false);
  readonly bookingReference = signal('');

  readonly checkoutForm = this.fb.nonNullable.group({
    passengerName: ['', Validators.required],
    passengerEmail: ['', [Validators.required, Validators.email]]
  });

  getSelectedSeatNumbers(): string {
    return this.bookingService.selectedSeats().map(s => s.number).join(', ');
  }

  processBooking(): void {
    if (this.checkoutForm.valid) {
      const randomRef = `BUS-${Math.floor(100000 + Math.random() * 900000)}`;
      this.bookingReference.set(randomRef);
      this.isConfirmed.set(true);
    }
  }

  resetAll(): void {
    this.isConfirmed.set(false);
    this.checkoutForm.reset();
    this.bookingService.resetSelection();
  }
}