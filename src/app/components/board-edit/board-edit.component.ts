import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styles: [],
})
export class BoardEditComponent {
  boardForm = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required]],
  });
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: Board
  ) {}

  ngOnInit() {
    this.boardForm.patchValue(this.data);
  }

  async editBoard() {
    if (this.boardForm.valid) {
      this.submitting = true;
      const updatedBoardData = this.boardForm.value;
      const boardId = this.data.id;
      const boardDocRef = doc(db, 'boards', boardId);
      await updateDoc(boardDocRef, {
        name: updatedBoardData.name,
        price: Number(updatedBoardData.price),
      });
      this.dialogService.close();
      this.boardForm.reset();
      this.submitting = false;
    }
  }
}
