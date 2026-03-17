import {
  afterNextRender,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Site {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

@Component({
  selector: 'app-sites',
  imports: [RouterLink],
  template: `
    @if (!loggedIn()) {
      <div class="alert alert-warning">
        You must be <a routerLink="/">logged in</a> to manage sites.
      </div>
    } @else {
      <h3>Add a new site</h3>
      <form class="w-50" method="post" action="/api/sites">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input id="name" class="form-control" name="name" type="text" />
        </div>
        <div class="mb-3">
          <label for="url" class="form-label">URL</label>
          <input
            id="url"
            class="form-control"
            name="url"
            type="text"
            placeholder="example.com"
          />
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>

      <hr />

      <h3>All sites</h3>
      @if (sites().length === 0) {
        <p class="text-muted">No sites yet.</p>
      } @else {
        <table class="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>URL</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            @for (site of sites(); track site.id) {
              <tr>
                <td><code>{{ site.id }}</code></td>
                <td>{{ site.name }}</td>
                <td>{{ site.url }}</td>
                <td>{{ site.createdAt }}</td>
              </tr>
            }
          </tbody>
        </table>
      }

      <hr />

      <h5>Integration</h5>
      <p>Add this inside <code>&lt;head&gt;</code>:</p>
      <textarea class="form-control font-monospace mb-3" rows="2" readonly
        [value]="scriptSrc()"></textarea>

      <p>Add this just before <code>&lt;/body&gt;</code> (replace <code>--SITE_ID--</code>):</p>
      <textarea class="form-control font-monospace" rows="2" readonly
        [value]="scriptCall"></textarea>
    }
  `,
})
export default class Sites {
  private http = inject(HttpClient);

  loggedIn = signal(false);
  sites = signal<Site[]>([]);
  private host = signal('');

  readonly scriptSrc = computed(
    () => `<script src="${this.host()}/api/tracker/js"><\/script>`,
  );
  readonly scriptCall = `<script>march("--SITE_ID--");<\/script>`;

  constructor() {
    afterNextRender(() => {
      this.host.set(window.location.origin);
      this.loadSites();
    });
  }

  private loadSites(): void {
    this.http.get<Site[]>('/api/sites').subscribe({
      next: (data) => {
        this.loggedIn.set(true);
        this.sites.set(data);
      },
      error: (err) => {
        if (err.status === 401) this.loggedIn.set(false);
      },
    });
  }
}
