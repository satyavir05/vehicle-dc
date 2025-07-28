import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private baseUrl = 'http://localhost:3000/logs';

  constructor(private http: HttpClient) {}

  public searchLogs(
    vehicleId?: string,
    code?: string,
    from?: string,
    to?: string
  ): Observable<any[]> {
    let params = new HttpParams();
    if (vehicleId) params = params.set('vehicle', vehicleId);
    if (code) params = params.set('code', code);
    if (from && to) {
      params = params.set('from', from).set('to', to);
    }
    return this.http.get<any[]>(this.baseUrl, { params });
  }

  public uploadLogFile(file: any): Promise<any> {
    return this.http.post<any>(this.baseUrl, file).toPromise();
  }

  public getAllLogs(): Promise<any> {
    return this.http.get<any>(`${this.baseUrl}/all`).toPromise();
  }
}
