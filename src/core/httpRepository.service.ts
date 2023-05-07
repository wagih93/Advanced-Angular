
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpRepositoryService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.baseUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, { params });
  }

  post<T>(url: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, data, this.httpOptions);
  }

  put<T>(url: string, data: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, data, this.httpOptions);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, this.httpOptions);
  }
}
