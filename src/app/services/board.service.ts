import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board } from '../interfaces/board';
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
export class BoardService {
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  boards$ = this.boardsSubject.asObservable();

  constructor() {
    this.getBoards();
  }

  getBoards() {
    const q = query(
      collection(db, 'boards'),
      orderBy('created', 'desc')
      // limit(1)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const boards: Board[] = [];
      querySnapshot.forEach((doc) => {
        boards.push({ id: doc.id, ...doc.data() } as Board);
      });
      this.boardsSubject.next(boards);
    });
  }
}
