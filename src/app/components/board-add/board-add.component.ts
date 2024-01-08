import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.component.html',
  styles: [],
})
export class BoardAddComponent {
  boardForm = this.fb.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
  });
  submitting: boolean = false;

  constructor(private fb: FormBuilder, private dialogService: DialogService) {}

  async addBoard() {
    if (this.boardForm.valid) {
      this.submitting = true;
      const boardData = this.boardForm.value;
      await addDoc(collection(db, 'boards'), {
        name: boardData.name,
        price: Number(boardData.price),
        created: serverTimestamp(),
      });
      this.dialogService.close();
      this.boardForm.reset();
      this.submitting = false;
    }
  }
}
