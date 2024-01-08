import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../interfaces/game';
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
export class GameService {
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  games$ = this.gamesSubject.asObservable();

  constructor() {
    this.getGames();
  }

  getGames() {
    const q = query(
      collection(db, 'games'),
      orderBy('created', 'desc')
      // limit(2)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const games: Game[] = [];
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() } as Game);
      });
      this.gamesSubject.next(games);
    });
  }
}
