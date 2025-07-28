// src/app/app.component.ts

import { Component } from '@angular/core';
import { LogSearchComponent } from './log-search/log-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LogSearchComponent],
  template: `<app-log-search></app-log-search>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vehicle-log-viewer';
}
