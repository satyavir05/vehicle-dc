import {
  Component,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogsService } from '../logs.service';

@Component({
  selector: 'app-log-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './log-search.component.html',
  styleUrls: ['./log-search.component.scss'],
})
export class LogSearchComponent implements OnInit {
  searchForm!: FormGroup;

  // Signals
  logs = signal<any[]>([]);
  loading = signal<boolean>(true);
  currentPage = signal<number>(1);
  readonly pageSize = 1000;

  // Computed signals
  paginatedLogs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.logs().slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.logs().length / this.pageSize)
  );

  constructor(private fb: FormBuilder, private logsService: LogsService) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      vehicleId: [''],
      errorCode: [''],
      fromDate: [''],
      toDate: [''],
    });

    this.logsService
      .getAllLogs()
      .then((res) => this.logs.set(res))
      .finally(() => this.loading.set(false));
  }

  onSearch(): void {
    const { vehicleId, errorCode, fromDate, toDate } = this.searchForm.value;
    this.loading.set(true);
    this.logsService
      .searchLogs(vehicleId, errorCode, fromDate, toDate)
      .subscribe({
        next: (data) => {
          this.logs.set(data);
          this.currentPage.set(1); // reset to first page
        },
        error: () => console.error('Search failed'),
        complete: () => this.loading.set(false),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.loading.set(true);
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.logsService
        .uploadLogFile(formData)
        .then((res) => {
          this.logs.set(res);
          this.currentPage.set(1); // reset to first page
        })
        .catch(() => console.log('Something went wrong'))
        .finally(() => this.loading.set(false));
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }
}
