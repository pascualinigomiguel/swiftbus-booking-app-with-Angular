export interface Seat {
  id: string;
  number: string;
  isBooked: boolean;
  price: number;
}

export interface Bus {
  id: string;
  name: string;
  type: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  seats: Seat[];
}

export interface SearchCriteria {
  from: string;
  to: string;
  date: string;
}