import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    loadComponent: () => import('./features/search-form').then(m => m.SearchFormComponent),
    title: 'Search Buses - SwiftBus'
  },
  {
    path: 'buses',
    loadComponent: () => import('./features/bus-list').then(m => m.BusListComponent),
    title: 'Available Buses'
  },
  {
    path: 'select-seats/:busId',
    loadComponent: () => import('./features/seat-selection.component').then(m => m.SeatSelectionComponent),
    title: 'Select Seats'
  },
  { path: '**', redirectTo: 'search' }
];