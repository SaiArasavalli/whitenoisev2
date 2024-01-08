import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-booking-delete',
  templateUrl: './booking-delete.component.html',
  styles: [],
})
export class BookingDeleteComponent {
  submitting: boolean = false;

  constructor(
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  async deleteBooking() {
    this.submitting = true;
    const bookingId = this.data;
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingDocRef);
    this.dialogService.close();
    this.submitting = false;
  }

  close() {
    this.dialogService.close();
  }
}
