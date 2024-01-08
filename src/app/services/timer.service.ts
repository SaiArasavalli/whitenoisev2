import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Timer } from '../interfaces/timer';
import {
  query,
  collection,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timersSubject = new BehaviorSubject<Timer[]>([]);
  timers$ = this.timersSubject.asObservable();

  constructor() {
    this.getTimers();
  }

  getTimers() {
    const q = query(collection(db, 'timers'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const timers: Timer[] = [];
      querySnapshot.forEach((doc) => {
        timers.push({ id: doc.id, ...doc.data() } as Timer);
      });
      this.timersSubject.next(timers);
    });
  }

  getTimerId(boardId: string) {
    const timer = this.timersSubject.value.find(
      (timer) => timer.boardId === boardId
    );
    return timer?.id;
  }

  async updateTimer(boardId: string, startTime: string, endTime: string) {
    const timerRef = doc(db, 'timers', this.getTimerId(boardId)!);
    await updateDoc(timerRef, {
      startTime: startTime,
      endTime: startTime,
    });
  }

  async updateStartTime(boardId: string, startTime: string) {
    const timerRef = doc(db, 'timers', this.getTimerId(boardId)!);
    await updateDoc(timerRef, {
      startTime: startTime,
    });
  }

  async updateEndTime(boardId: string, endTime: string) {
    const timerRef = doc(db, 'timers', this.getTimerId(boardId)!);
    await updateDoc(timerRef, {
      endTime: endTime,
    });
  }

  async clearTimers(boardId: string) {
    const timerRef = doc(db, 'timers', this.getTimerId(boardId)!);
    await updateDoc(timerRef, {
      startTime: '',
      endTime: '',
    });
  }
}
