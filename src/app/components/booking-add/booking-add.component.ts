import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-booking-add',
  templateUrl: './booking-add.component.html',
  styles: [],
})
export class BookingAddComponent {
  bookingForm = this.fb.group({
    name: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: [''],
    phone: [''],
    bookingDate: [new Date().toISOString(), [Validators.required]],
  });
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private datePipe: DatePipe
  ) {}

  async addBooking() {
    if (this.bookingForm.valid) {
      this.submitting = true;
      const bookingData = this.bookingForm.value;
      await addDoc(collection(db, 'bookings'), {
        name: bookingData.name,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        phone: bookingData.phone,
        bookingDate: new Date(bookingData.bookingDate!).toISOString(),
        created: serverTimestamp(),
      });
      this.dialogService.close();
      this.bookingForm.reset();
      this.submitting = false;
    }
  }
}
