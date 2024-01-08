import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';
import { Game } from 'src/app/interfaces/game';
import { Order } from 'src/app/interfaces/order';
import { BoardService } from 'src/app/services/board.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GameService } from 'src/app/services/game.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styles: [],
})
export class BillComponent {
  submitting: boolean = false;
  boards: Board[] = [];
  customers: Customer[] = [];
  games: Game[] = [];
  orders: Order[] = [];
  gameAmount: number = 0;
  orderAmount: number = 0;

  billForm = this.fb.group({
    player: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private boardService: BoardService,
    private gameService: GameService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.boardService.boards$.subscribe((boards) => (this.boards = boards));
    this.customerService.customers$.subscribe(
      (customers) => (this.customers = this.sortCustomersByName(customers))
    );
    this.orderService.orders$.subscribe((orders) => (this.orders = orders));
    this.gameService.games$.subscribe((games) => (this.games = games));
  }

  private sortCustomersByName(customers: Customer[]): Customer[] {
    return customers.sort((a, b) => a.name.localeCompare(b.name));
  }

  parseTimeToDate(time: string) {
    const [hour, min] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, min);
    return date;
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

  countLostPlayers(players: any[]): number {
    return players.filter((player) => player.lost).length;
  }

  isPlayerSub(playerName: string) {
    const player = this.customers.find(
      (customer) => customer.name.toLowerCase() === playerName.toLowerCase()
    );
    return player?.sub;
  }

  calculate() {
    this.gameAmount = 0;
    this.orderAmount = 0;
    if (this.billForm.valid) {
      const customer = this.billForm.value.player;
      const startDate = new Date(this.billForm.value.startDate!);
      const endDate = new Date(this.billForm.value.endDate!);
      endDate.setHours(23, 59, 59, 999);

      this.orders.forEach((order) => {
        const orderDate = new Date(order.created.toDate());
        if (
          order.customer.toLowerCase() === customer?.toLowerCase() &&
          order.payment === 'PENDING' &&
          orderDate >= startDate &&
          orderDate <= endDate
        ) {
          this.orderAmount += Number(order.totalAmount);
        }
      });

      this.games.forEach((game) => {
        const gameDate = new Date(game.created.toDate());
        game.players?.forEach((player) => {
          if (
            player.name.toLowerCase() === customer?.toLowerCase() &&
            player.lost === true &&
            gameDate >= startDate &&
            gameDate <= endDate
          ) {
            if (this.isPlayerSub(player.name)) {
              this.gameAmount += Math.round(
                this.calculateMinutes(game.startTime, game.endTime!) /
                  this.countLostPlayers(game.players!)
              );
            } else if (!this.isPlayerSub(player.name)) {
              this.gameAmount += Math.round(
                this.calculateTotalAmount(
                  game.board,
                  game.startTime,
                  game.endTime!
                ) / this.countLostPlayers(game.players!)
              );
            }
          }
        });
      });
    }
    console.log(
      `Game Bill : ${this.gameAmount} \n Order Bill : ${this.orderAmount}`
    );
  }
}
