import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';
import { BoardService } from 'src/app/services/board.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styles: [],
})
export class GameAddComponent {
  submitting: boolean = false;
  boards: Board[] = [];
  customers: Customer[] = [];

  gameForm = this.fb.group({
    board: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', []],
    players: this.fb.array([]),
    comment: [''],
    created: [new Date().toISOString()],
  });

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private boardService: BoardService,
    private customerService: CustomerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.boardService.boards$.subscribe((boards) => (this.boards = boards));
    this.customerService.customers$.subscribe(
      (customers) => (this.customers = this.sortCustomersByName(customers))
    );
  }

  private sortCustomersByName(customers: Customer[]): Customer[] {
    return customers.sort((a, b) => a.name.localeCompare(b.name));
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
    if (this.gameForm.valid) {
      this.submitting = true;
      const gameData = this.gameForm.value;
      await addDoc(collection(db, 'games'), {
        board: gameData.board,
        startTime: gameData.startTime,
        endTime: gameData.endTime,
        players: gameData.players,
        comment: gameData.comment,
        created: Timestamp.fromDate(new Date(gameData.created!)),
      });
      this.dialogService.close();
      this.gameForm.reset();
      this.submitting = false;
    }
  }
}
