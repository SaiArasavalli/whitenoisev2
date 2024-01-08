import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../interfaces/order';
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
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.getOrders();
  }

  getOrders() {
    const q = query(
      collection(db, 'orders'),
      orderBy('created', 'desc')
      // limit(3)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      this.ordersSubject.next(orders);
    });
  }
}
