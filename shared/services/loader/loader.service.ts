import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable().pipe(debounceTime(200));
  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }
}
