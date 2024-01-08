import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Customer } from 'src/app/interfaces/customer';
import { Timer } from 'src/app/interfaces/timer';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogService } from 'src/app/services/dialog.service';
import { TimerEditComponent } from '../timer-edit/timer-edit.component';
import { Board } from 'src/app/interfaces/board';
import { TimerService } from 'src/app/services/timer.service';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { CustomerAddComponent } from '../customer-add/customer-add.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styles: [],
})
export class TimerComponent {
  submitting: boolean = false;
  @Input() board!: Board;
  customers: Customer[] = [];
  startTime: any;
  endTime: any;
  duration: string = '00:00';
  durationSeconds: string = '00';
  intervalId: any;

  gameForm = this.fb.group({
    players: this.fb.array([], Validators.required),
  });

  timeForm = this.fb.group({
    startTime: ['', Validators.required],
    endTime: [''],
  });

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private customerService: CustomerService,
    private timerService: TimerService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.timerService.timers$.subscribe((timers) => {
      const timerValues = timers.find(
        (timer) => timer.boardId === this.board.id
      );
      if (timerValues?.startTime) {
        this.startTime = this.parseTimeToDate(timerValues.startTime);
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.timer(), 1000);
      }
      if (timerValues?.endTime) {
        this.endTime = this.parseTimeToDate(timerValues.endTime);
        clearInterval(this.intervalId);
      }
    });
    this.customerService.customers$.subscribe(
      (customers) => (this.customers = this.sortCustomersByName(customers))
    );
  }

  private sortCustomersByName(customers: Customer[]): Customer[] {
    return customers.sort((a, b) => a.name.localeCompare(b.name));
  }

  parseTimeToDate(timeString: any): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  timer() {
    if (this.startTime && !this.endTime) {
      const currentDate = new Date();
      const elapsedTimeInSeconds = Math.floor(
        (currentDate.getTime() - this.startTime.getTime()) / 1000
      );

      const hours = this.padNumber(Math.floor(elapsedTimeInSeconds / 3600));
      const minutes = this.padNumber(
        Math.floor((elapsedTimeInSeconds % 3600) / 60)
      );
      const seconds = this.padNumber(Math.floor(elapsedTimeInSeconds % 60));

      this.duration = `${hours}:${minutes}`;
      this.durationSeconds = `${seconds}`;
    }
  }

  getTimeStringFromDate(date: Date) {
    return this.datePipe.transform(date, 'HH:mm');
  }

  getFormattedTime(date: Date) {
    return this.datePipe.transform(date, 'hh:mm a');
  }

  padNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  start() {
    if (!this.startTime) {
      this.timerService.updateStartTime(
        this.board.id,
        this.getTimeStringFromDate(new Date())!
      );
    }
  }

  stop() {
    if (!this.endTime) {
      this.timerService.updateEndTime(
        this.board.id,
        this.getTimeStringFromDate(new Date())!
      );
    }
  }

  get players() {
    return this.gameForm.get('players') as FormArray;
  }

  addPlayer() {
    this.players.push(
      this.fb.group({ name: [''], lost: false, payment: ['PENDING'] })
    );
  }

  removePlayer(index: number) {
    this.players.removeAt(index);
  }

  async addGame() {
    if (
      this.gameForm.valid &&
      this.startTime &&
      this.endTime &&
      this.gameForm.value.players?.length
    ) {
      this.submitting = true;
      const gameData = this.gameForm.value;
      await addDoc(collection(db, 'games'), {
        board: this.board.name,
        startTime: this.getTimeStringFromDate(this.startTime),
        endTime: this.getTimeStringFromDate(this.endTime),
        players: gameData.players,
        created: serverTimestamp(),
      });
      this.submitting = false;
      this.reset();
    }
  }

  reset() {
    this.gameForm = this.fb.group({
      players: this.fb.array([]),
    });
    this.timerService.clearTimers(this.board.id);
    this.startTime = '';
    this.endTime = '';
    this.duration = '00:00';
    this.durationSeconds = '00';
  }

  editTime(boardId: string) {
    this.dialogService.open(TimerEditComponent, boardId);
  }

  newPlayer() {
    this.dialogService.open(CustomerAddComponent, null);
  }
}
