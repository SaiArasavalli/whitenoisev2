import { Component } from '@angular/core';
import { Board } from 'src/app/interfaces/board';
import { BoardService } from 'src/app/services/board.service';
import { DialogService } from 'src/app/services/dialog.service';
import { BoardAddComponent } from '../board-add/board-add.component';
import { BoardDeleteComponent } from '../board-delete/board-delete.component';
import { BoardEditComponent } from '../board-edit/board-edit.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styles: [],
})
export class BoardListComponent {
  boards$ = this.boardService.boards$;
  displayedColumns: string[] = ['id', 'name', 'price', 'actions'];

  constructor(
    private boardService: BoardService,
    private dialogService: DialogService
  ) {}

  addBoard() {
    this.dialogService.open(BoardAddComponent, null);
  }

  editBoard(board: Board) {
    this.dialogService.open(BoardEditComponent, board);
  }

  deleteBoard(boardId: string) {
    this.dialogService.open(BoardDeleteComponent, boardId);
  }
}
