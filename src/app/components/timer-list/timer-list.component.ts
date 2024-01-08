import { Component } from '@angular/core';
import { Board } from 'src/app/interfaces/board';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-timer-list',
  templateUrl: './timer-list.component.html',
  styles: [],
})
export class TimerListComponent {
  boards: Board[] = [];
  constructor(private boardService: BoardService) {}

  ngOnInit() {
    this.boardService.boards$.subscribe(
      (boards) => (this.boards = boards.reverse())
    );
  }
}
