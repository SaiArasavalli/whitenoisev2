import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../interfaces/menu';
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
export class MenuService {
  private menuSubject = new BehaviorSubject<Menu[]>([]);
  menu$ = this.menuSubject.asObservable();

  constructor() {
    this.getMenu();
  }

  getMenu() {
    const q = query(
      collection(db, 'menu'),
      orderBy('created', 'desc')
      // limit(2)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const menu: Menu[] = [];
      querySnapshot.forEach((doc) => {
        menu.push({ id: doc.id, ...doc.data() } as Menu);
      });
      this.menuSubject.next(menu);
    });
  }
}
