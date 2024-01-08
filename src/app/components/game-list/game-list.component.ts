import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { combineLatest, startWith, map, min } from 'rxjs';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';
import { BoardService } from 'src/app/services/board.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogService } from 'src/app/services/dialog.service';
import { GameService } from 'src/app/services/game.service';
import { GameAddComponent } from '../game-add/game-add.component';
import { GameEditComponent } from '../game-edit/game-edit.component';
import { Game } from 'src/app/interfaces/game';
import { GameDeleteComponent } from '../game-delete/game-delete.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styles: [],
})
export class GameListComponent {
  customers: Customer[] = [];
  boards: Board[] = [];
  games$ = this.gameService.games$;

  displayedColumns: string[] = [
    'id',
    'board',
    'startTime',
    'endTime',
    'duration',
    'totalAmount',
    'players',
    'date',
    'comment',
    'actions',
  ];

  displayedColumns2: string[] = ['name', 'charge', 'payment'];

  searchForm = this.fb.group({
    name: [''],
    startDate: [''],
    endDate: [''],
    payment: [''],
  });

  constructor(
    private gameService: GameService,
    private customerService: CustomerService,
    private boardService: BoardService,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.customerService.customers$.subscribe(
      (customers) => (this.customers = customers)
    );
    this.boardService.boards$.subscribe((boards) => (this.boards = boards));
    this.games$ = combineLatest([
      this.gameService.games$,
      this.searchForm.valueChanges.pipe(startWith(this.searchForm.value)),
    ]).pipe(
      map(([games, searchFormValue]) => {
        const filteredGames = games.filter((game) => {
          const nameCondition =
            !searchFormValue.name ||
            game.players?.some((player) =>
              player.name
                .toLowerCase()
                .startsWith(searchFormValue.name!.toLowerCase())
            );

          const date = new Date(game.created.toDate());
          const startDate = new Date(searchFormValue.startDate!);
          const endDate = new Date(searchFormValue.endDate!);
          endDate.setHours(23, 59, 59, 999);

          const dateCondition =
            !searchFormValue.startDate ||
            !searchFormValue.endDate ||
            (date >= startDate && date <= endDate);

          const paymentCondition =
            !searchFormValue.payment ||
            game.players?.some(
              (player) =>
                player.payment === searchFormValue.payment &&
                player.name
                  .toLowerCase()
                  .startsWith(searchFormValue.name!.toLowerCase())
            );

          return nameCondition && dateCondition && paymentCondition;
        });
        return filteredGames;
      })
    );
  }

  parseTimeToDate(time: string) {
    const [hour, min] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, min);
    return date;
  }

  padNumber(number: number): string {
    return number.toString().padStart(2, '0');
  }

  calculateTotalAmount(
    boardName: string,
    startTime: string,
    endTime: string
  ): number {
    const board = this.boards.find((board) => board.name === boardName);

    const startTimeObj = this.parseTimeToDate(startTime).getTime();
    const endTimeObj = this.parseTimeToDate(endTime).getTime();

    const milliSeconds = endTimeObj - startTimeObj;
    const seconds = milliSeconds / 1000;
    if (board) {
      return (board.price / 3600) * seconds;
    }
    return 0;
  }

  calculateMinutes(startTime: string, endTime: string) {
    const startTimeObj = this.parseTimeToDate(startTime).getTime();
    const endTimeObj = this.parseTimeToDate(endTime).getTime();

    const milliSeconds = endTimeObj - startTimeObj;
    const seconds = milliSeconds / 1000;
    const minutes = seconds / 60;

    return minutes;
  }

  calcuateDuration(startTime: string, endTime: string): string {
    const startTimeObj = this.parseTimeToDate(startTime).getTime();
    const endTimeObj = this.parseTimeToDate(endTime).getTime();

    const milliSeconds = endTimeObj - startTimeObj;
    const hours = Math.floor(milliSeconds / (1000 * 60 * 60));
    const minutes = (milliSeconds % (1000 * 60 * 60)) / (1000 * 60);

    const formattedDuration = `${this.padNumber(hours)}H : ${this.padNumber(
      minutes
    )}M`;
    return formattedDuration;
  }

  getFormattedTime(timeString: string): string {
    const dateObject = this.parseTimeToDate(timeString);
    return this.datePipe.transform(dateObject, 'h:mm a') || '';
  }

  countLostPlayers(players: any[]): number {
    return players.filter((player) => player.lost).length;
  }

  isPlayerSub(playerName: string) {
    const player = this.customers.find(
      (customer) => customer.name.toLowerCase() === playerName.toLowerCase()
    );
    return player?.sub;
  }

  round(value: number) {
    return Math.round(value);
  }

  addGame() {
    this.dialogService.open(GameAddComponent, null);
  }

  editGame(game: Game) {
    this.dialogService.open(GameEditComponent, game);
  }

  deleteGame(gameId: string) {
    this.dialogService.open(GameDeleteComponent, gameId);
  }
}
