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
        return this.http.put(
            `http://localhost:8080/api/sondages/${id}/publish`,
            {},
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            responseType: 'text'
            }
        );
    }

    unpublish(id: number) {
        const token = localStorage.getItem('token');

        return this.http.put(
            `http://localhost:8080/api/sondages/${id}/unpublish`,
            {},
            {
            headers: {
                Authorization: `Bearer ${token}`
            },
            responseType: 'text'
            }
        );
    }

    getMySondages() {
        return this.http.get<any[]>('http://localhost:8080/api/sondages/me', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
    }

    getById(id: any) {
        const token = localStorage.getItem('token');

        return this.http.get(`http://localhost:8080/api/sondages/public/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
    }
    
}