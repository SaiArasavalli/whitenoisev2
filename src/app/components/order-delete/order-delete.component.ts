import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-order-delete',
  templateUrl: './order-delete.component.html',
  styles: [],
})
export class OrderDeleteComponent {
  submitting: boolean = false;
  constructor(
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  async deleteOrder() {
    this.submitting = true;
    const orderId = this.data;
    const orderDocRef = doc(db, 'orders', orderId);
    await deleteDoc(orderDocRef);
    this.dialogService.close();
    this.submitting = false;
  }

  close() {
    this.dialogService.close();
  }
}
