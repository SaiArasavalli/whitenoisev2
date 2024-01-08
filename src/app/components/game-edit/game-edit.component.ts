import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { async } from 'rxjs';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';
import { Game } from 'src/app/interfaces/game';
import { BoardService } from 'src/app/services/board.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styles: [],
})
export class GameEditComponent {
  submitting: boolean = false;
  boards: Board[] = [];
  customers: Customer[] = [];

  gameForm = this.fb.group({
    board: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', []],
    players: this.fb.array([]),
    comment: [''],
    created: [this.data.created.toDate().toISOString()],
  });

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private boardService: BoardService,
    private customerService: CustomerService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: Game
  ) {}

  ngOnInit() {
    const gameData = {
      board: this.data.board,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      players: this.data.players,
      comment: this.data.comment,
    };
    this.gameForm.patchValue(gameData);
    this.setFormPlayers(this.data.players!);
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

  setFormPlayers(players: any[]) {
    if (players) {
      players.forEach((player) => {
        this.players.push(this.fb.group(player));
      });
    }
  }

  addPlayer() {
    this.players.push(
      this.fb.group({ name: [''], lost: false, payment: ['PENDING'] })
    );
  }

  removePlayer(index: number) {
    this.players.removeAt(index);
  }

  async editGame() {
    if (this.gameForm.valid) {
      this.submitting = true;
      const gameId = this.data.id;
      const gameData = this.gameForm.value;
      const gameRef = doc(db, 'games', gameId);
      await updateDoc(gameRef, {
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
