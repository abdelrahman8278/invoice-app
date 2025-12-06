import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../core/models/item.interface';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {

  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}${API_ENDPOINTS.products}`);
  }
}
