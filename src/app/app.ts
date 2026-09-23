import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <header class="sticky-top shadow-sm bg-white">
      <app-header />
    </header>

    <main class="container py-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <router-outlet />
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {}