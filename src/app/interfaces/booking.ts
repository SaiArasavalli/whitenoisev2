import { Timestamp } from 'firebase/firestore';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  startTime: string;
  endTime: string;
  bookingDate: string;
  created: Timestamp;
}
