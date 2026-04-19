import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sondage } from '../models/sondage.model';

@Injectable({
  providedIn: 'root'
})
export class SondageService {

  private api = 'http://localhost:8080/api/sondages';

  constructor(private http: HttpClient) {}

  // =========================
  // CREATE
  // =========================
  create(data: any) {
    return this.http.post(this.api, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'text' as 'json'
    });
  }

  // =========================
  // GET ALL
  // =========================
  getAll() {
    return this.http.get<Sondage[]>(this.api);
  }

  // =========================
  // GET BY ID (FIXED TYPING)
  // =========================
  getById(id: number) {
    return this.http.get<Sondage>(`${this.api}/public/${id}`);
  }

  // =========================
  // UPDATE (🔥 YOU WERE MISSING THIS)
  // =========================
  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  // =========================
  // DELETE
  // =========================
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  // =========================
  // PUBLISH
  // =========================
  publish(id: number) {
    return this.http.put(`${this.api}/${id}/publish`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'text'
    });
  }

  // =========================
  // UNPUBLISH
  // =========================
  unpublish(id: number) {
    return this.http.put(`${this.api}/${id}/unpublish`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'text'
    });
  }

  // =========================
  // REJECT (add token ⚠️)
  // =========================
  reject(id: number) {
    return this.http.put(`${this.api}/${id}/reject`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'text'
    });
  }

  // =========================
  // MY SONDAGES
  // =========================
  getMySondages() {
    return this.http.get<Sondage[]>(`${this.api}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}