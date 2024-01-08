import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking } from '../interfaces/booking';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebase';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  bookings$ = this.bookingsSubject.asObservable();

  constructor() {
    this.getBookings();
  }

  getBookings() {
    const q = query(
      collection(db, 'bookings'),
      orderBy('bookingDate', 'desc'),
      orderBy('startTime', 'desc')
      // limit(1)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
      });

      this.bookingsSubject.next(bookings);
    });
  }
}
