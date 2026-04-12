import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = false;

  get loading() {
    return this._loading;
  }

  show() {
    this._loading = true;
  }

  hide() {
    this._loading = false;
  }
}