import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Booking } from 'src/app/interfaces/booking';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styles: [],
})
export class BookingEditComponent {
  bookingDate = this.datePipe.transform(this.data.bookingDate, 'mm/dd/yyyy');
  bookingForm = this.fb.group({
    name: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: [''],
    phone: [''],
    bookingDate: [this.bookingDate, [Validators.required]],
  });
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private datePipe: DatePipe,

    @Inject(MAT_DIALOG_DATA) public data: Booking
  ) {}

  ngOnInit() {
    this.bookingForm.patchValue(this.data);
  }

  async editBooking() {
    if (this.bookingForm.valid) {
      this.submitting = true;
      const updatedBookingData = this.bookingForm.value;
      const bookingId = this.data.id;
      const bookingDocRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingDocRef, {
        name: updatedBookingData.name,
        startTime: updatedBookingData.startTime,
        endTime: updatedBookingData.endTime,
        phone: updatedBookingData.phone,
        bookingDate: new Date(updatedBookingData.bookingDate!).toISOString(),
      });
      this.dialogService.close();
      this.bookingForm.reset();
      this.submitting = false;
    }
  }
}
