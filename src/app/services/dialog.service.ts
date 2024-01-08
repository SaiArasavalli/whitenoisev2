import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dialogRef!: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {}

  open(component: any, data: any) {
    this.dialogRef = this.dialog.open(component, { data: data });
  }
  close() {
    this.dialogRef.close();
  }
}
