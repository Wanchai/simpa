import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">Simpa</a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/sites">Sites</a>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-outlet />
    </div>
  `,
  styles: ``,
})
export class App {}
