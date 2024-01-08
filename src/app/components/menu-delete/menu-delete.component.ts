import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-menu-delete',
  templateUrl: './menu-delete.component.html',
  styles: [],
})
export class MenuDeleteComponent {
  submitting: boolean = false;

  constructor(
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  async deleteItem() {
    this.submitting = true;
    const itemId = this.data;
    const menuDocRef = doc(db, 'menu', itemId);
    await deleteDoc(menuDocRef);
    this.dialogService.close();
    this.submitting = false;
  }

  close() {
    this.dialogService.close();
  }
}
