import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Site {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

interface SiteAnalytics {
  site: Site;
  data: string; // JSON string — Chart.js dataset
  referers: { url: string; count: number }[];
}

@Component({
  selector: 'app-home',
  template: `
    @if (loading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading…</span>
        </div>
      </div>
    } @else if (!loggedIn()) {
      <form class="col-sm-4 col-md-3" method="post" action="/api/auth/login">
        <h4 class="mb-3">Log in</h4>
        <div class="mb-3">
          <label for="passfield" class="form-label">Password</label>
          <input
            id="passfield"
            class="form-control"
            name="passfield"
            type="password"
            autofocus
          />
        </div>
        <button type="submit" class="btn btn-primary">Go</button>
      </form>
    } @else {
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Dashboard</h4>
        <form method="post" action="/api/auth/logout">
          <button type="submit" class="btn btn-outline-secondary btn-sm">
            Log out
          </button>
        </form>
      </div>

      @if (analytics().length === 0) {
        <div class="alert alert-info">
          No sites tracked yet. <a href="/sites">Add a site</a> to get started.
        </div>
      } @else {
        <ul class="nav nav-tabs" id="site-tabs" role="tablist">
          @for (item of analytics(); track item.site.id; let i = $index) {
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                [class.active]="i === 0"
                data-bs-toggle="tab"
                [attr.data-bs-target]="'#site-' + item.site.id"
                type="button"
                role="tab"
              >
                {{ item.site.name }}
              </button>
            </li>
          }
        </ul>

        <div class="tab-content mt-1" id="site-tab-content">
          @for (item of analytics(); track item.site.id; let i = $index) {
            <div
              class="tab-pane fade"
              [class.show]="i === 0"
              [class.active]="i === 0"
              [id]="'site-' + item.site.id"
              role="tabpanel"
            >
              <div class="mt-3">
                <canvas [id]="'canvas-' + item.site.id"></canvas>
              </div>

              @if (item.referers.length > 0) {
                <h5 class="mt-4">Referrers</h5>
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Referrer</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (ref of item.referers; track ref.url) {
                      <tr>
                        <td>{{ ref.url }}</td>
                        <td>{{ ref.count }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              } @else {
                <p class="text-muted mt-3">No referrer data yet.</p>
              }
            </div>
          }
        </div>
      }
    }
  `,
})
export default class Home {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(true);
  loggedIn = signal(false);
  analytics = signal<SiteAnalytics[]>([]);

  constructor() {
    afterNextRender(() => this.loadData());
  }

  private loadData(): void {
    this.http.get<SiteAnalytics[]>('/api/analytics').subscribe({
      next: (data) => {
        this.loggedIn.set(true);
        this.analytics.set(data);
        this.loading.set(false);
        // Force sync DOM update so canvases exist before Chart.js runs
        this.cdr.detectChanges();
        this.initCharts(data);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) this.loggedIn.set(false);
      },
    });
  }

  private async initCharts(items: SiteAnalytics[]): Promise<void> {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);

    for (const item of items) {
      const canvas = document.getElementById(
        'canvas-' + item.site.id,
      ) as HTMLCanvasElement | null;
      if (canvas) {
        new Chart(canvas, { type: 'line', data: JSON.parse(item.data) });
      }
    }
  }
}
