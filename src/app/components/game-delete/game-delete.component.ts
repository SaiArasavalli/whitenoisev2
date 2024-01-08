import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-game-delete',
  templateUrl: './game-delete.component.html',
  styles: [],
})
export class GameDeleteComponent {
  submitting: boolean = false;
  constructor(
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  async deleteGame() {
    this.submitting = true;
    const gameId = this.data;
    const gameDocRef = doc(db, 'games', gameId);
    await deleteDoc(gameDocRef);
    this.dialogService.close();
    this.submitting = false;
  }

  close() {
    this.dialogService.close();
  }
}
