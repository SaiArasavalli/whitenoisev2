import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-board-delete',
  templateUrl: './board-delete.component.html',
  styles: [],
})
export class BoardDeleteComponent {
  submitting: boolean = false;

  constructor(
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  async deleteBoard() {
    this.submitting = true;
    const boardId = this.data;
    const boardDocRef = doc(db, 'boards', boardId);
    await deleteDoc(boardDocRef);
    this.dialogService.close();
    this.submitting = false;
  }

  close() {
    this.dialogService.close();
  }
}
