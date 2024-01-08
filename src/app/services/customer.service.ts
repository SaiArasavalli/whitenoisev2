import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../interfaces/customer';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$ = this.customersSubject.asObservable();

  constructor() {
    this.getCustomers();
  }

  getCustomers() {
    const q = query(
      collection(db, 'customers'),
      orderBy('created', 'desc')
      // limit(2)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customers: Customer[] = [];
      querySnapshot.forEach((doc) => {
        customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      this.customersSubject.next(customers);
    });
  }
}
