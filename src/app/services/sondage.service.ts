import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SondageService {

    private api = 'http://localhost:8080/api/sondages';

    constructor(private http: HttpClient) {}

    create(data: any) {
        const token = localStorage.getItem('token');

        return this.http.post(this.api, data, {
            headers: {
            Authorization: `Bearer ${token}`
            },
            responseType: 'text' as 'json' // 🔥 FIX
        });
    }

    getAll() {
        return this.http.get<any[]>(this.api);
    }

    delete(id: number) {
        return this.http.delete(`${this.api}/${id}`);
    }

    publish(id: number) {
        return this.http.post(`${this.api}/${id}/publish`, {});
    }
}