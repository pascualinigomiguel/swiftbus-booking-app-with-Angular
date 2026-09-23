import { Injectable, signal, computed } from '@angular/core';
import { Bus, SearchCriteria, Seat } from '../models/bus.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  // --- Reactive State Signals ---
  readonly searchCriteria = signal<SearchCriteria>({
    from: 'New York',
    to: 'Boston',
    date: new Date().toISOString().split('T')[0]
  });

  readonly selectedBus = signal<Bus | null>(null);
  readonly selectedSeatIds = signal<string[]>([]);

  // --- Mock Database Stream ---
  private readonly busRepository = signal<Bus[]>([
    {
      id: 'BUS-101',
      name: 'Express Liner 3000',
      type: 'AC Luxury Sleeper',
      origin: 'New York',
      destination: 'Boston',
      departureTime: '08:00 AM',
      arrivalTime: '12:30 PM',
      basePrice: 45,
      seats: Array.from({ length: 16 }, (_, i) => ({
        id: `seat-${i + 1}`,
        number: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
        isBooked: [1, 4, 7, 10].includes(i),
        price: 45
      }))
    },
    {
      id: 'BUS-102',
      name: 'Metro Traveler Express',
      type: 'Executive Seater',
      origin: 'New York',
      destination: 'Boston',
      departureTime: '11:15 AM',
      arrivalTime: '03:45 PM',
      basePrice: 32,
      seats: Array.from({ length: 16 }, (_, i) => ({
        id: `seat-${i + 1}`,
        number: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`,
        isBooked: [2, 5, 8].includes(i),
        price: 32
      }))
    }
  ]);

  // --- Derived Signal Computations ---
  readonly availableBuses = computed(() => {
    const { from, to } = this.searchCriteria();
    if (!from || !to) return [];
    
    return this.busRepository().filter(
      b => b.origin.toLowerCase().includes(from.toLowerCase().trim()) &&
           b.destination.toLowerCase().includes(to.toLowerCase().trim())
    );
  });

  readonly selectedSeats = computed(() => {
    const bus = this.selectedBus();
    if (!bus) return [];
    return bus.seats.filter(s => this.selectedSeatIds().includes(s.id));
  });

  readonly totalFare = computed(() => {
    return this.selectedSeats().reduce((sum, seat) => sum + seat.price, 0);
  });

  // --- State Actions ---
  setSearchCriteria(criteria: SearchCriteria): void {
    this.updateSearch(criteria);
  }

  updateSearch(criteria: SearchCriteria): void {
    this.searchCriteria.set(criteria);
    this.resetSelection();
  }

  selectBus(bus: Bus): void {
    if (this.selectedBus()?.id === bus.id) return;
    this.selectedBus.set(bus);
    this.selectedSeatIds.set([]);
  }

  toggleSeat(seatId: string): void {
    this.toggleSeatSelection(seatId);
  }

  toggleSeatSelection(seatId: string): void {
    this.selectedSeatIds.update(current => 
      current.includes(seatId) 
        ? current.filter(id => id !== seatId)
        : [...current, seatId]
    );
  }

  clearBooking(): void {
    this.resetSelection();
  }

  readonly totalPrice = computed(() => this.totalFare());

  resetSelection(): void {
    this.selectedBus.set(null);
    this.selectedSeatIds.set([]);
  }
}