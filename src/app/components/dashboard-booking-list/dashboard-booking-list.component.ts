import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { combineLatest, startWith, map } from 'rxjs';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/services/booking.service';
import { DialogService } from 'src/app/services/dialog.service';
import { BookingAddComponent } from '../booking-add/booking-add.component';
import { BookingDeleteComponent } from '../booking-delete/booking-delete.component';
import { BookingEditComponent } from '../booking-edit/booking-edit.component';

@Component({
  selector: 'app-dashboard-booking-list',
  templateUrl: './dashboard-booking-list.component.html',
  styles: [],
})
export class DashboardBookingListComponent {
  bookings: Booking[] = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'startTime',
    'endTime',
    'bookingDate',
    'phone',
    'actions',
  ];

  searchForm = this.fb.group({
    name: [''],
    startDate: [''],
    endDate: [''],
  });

  constructor(
    private bookingService: BookingService,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const today = new Date();
    this.bookingService.bookings$.subscribe((updatedBookings) => {
      const todayBookings = updatedBookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (
          bookingDate.getDate() === today.getDate() &&
          bookingDate.getMonth() === today.getMonth() &&
          bookingDate.getFullYear() === today.getFullYear()
        );
      });
      this.bookings = todayBookings;
    });
  }

  addBooking() {
    this.dialogService.open(BookingAddComponent, null);
  }

  editBooking(booking: Booking) {
    this.dialogService.open(BookingEditComponent, booking);
  }

  deleteBooking(bookingId: string) {
    this.dialogService.open(BookingDeleteComponent, bookingId);
  }

  parseTime(timeString: string) {
    const date = new Date();
    const [hour, min] = timeString.split(':');
    date.setHours(Number(hour), Number(min));
    return this.datePipe.transform(date, 'hh:mm a');
  }
}
