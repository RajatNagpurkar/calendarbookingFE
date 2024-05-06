import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private baseUrl = 'http://localhost:8282/bookings';

  constructor(private http: HttpClient) { }

  getRoom(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/fetch/${id}`);
  }

  createRoom(room: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/book`, room, { responseType: 'text' });
  }

  updateRoom(id: number, value: any): Observable<Object> {
  
    return this.http.put(`${this.baseUrl}/${id}`, value, { responseType: 'text' });
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getRoomsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
