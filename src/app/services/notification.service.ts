import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  analystNomenclature = new Subject();
  public dialogFormDataSubscriber$ = this.analystNomenclature.asObservable();

  emitDialogFormData(data: any) {
    console.log('inside emitDialogFormData');

    this.analystNomenclature.next(data);
  }


  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }
}
