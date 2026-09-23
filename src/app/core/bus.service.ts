import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { Bus, SearchCriteria, Seat } from '../models/bus.model';

@Injectable({ providedIn: 'root' })
export class BusService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://api.busprovider.com/v1'; // API endpoint URL

  readonly buses = signal<Bus[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  searchRealTimeBuses(criteria: SearchCriteria) {
    this.loading.set(true);

    const params = new HttpParams()
      .set('source', criteria.from)
      .set('destination', criteria.to)
      .set('doj', criteria.date); // Date of Journey

    return this.http.get<any[]>(`${this.apiUrl}/schedules`, { params }).pipe(
      // Map third-party response format to local Bus model
      map(apiResponse => apiResponse.map(item => ({
        id: item.schedule_id,
        name: item.operator_title,
        type: item.bus_category,
        origin: item.source_city,
        destination: item.destination_city,
        departureTime: item.departure_time,
        arrivalTime: item.arrival_time,
        basePrice: item.fare_amount,
        seats: item.seat_layout.map((s: any) => ({
          id: s.seat_id,
          number: s.seat_number,
          isBooked: s.is_occupied,
          price: s.seat_fare || item.fare_amount
        }))
      }))),
      catchError(err => {
        console.error('API Error:', err);
        return of([]);
      })
    ).subscribe(data => {
      this.buses.set(data);
      this.loading.set(false);
    });
  }

  getSeatsByBusId(busId: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Seat[]>(`${this.apiUrl}/schedules/${busId}/seats`).pipe(
      catchError(err => {
        console.error('Seat API Error:', err);
        this.error.set('Failed to load seat layout. Please try again later.');
        this.loading.set(false);
        return of([]);
      })
    );
  }
}