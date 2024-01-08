import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-timer-edit',
  templateUrl: './timer-edit.component.html',
  styles: [],
})
export class TimerEditComponent {
  timerForm = this.fb.group({
    startTime: ['', [Validators.required]],
    endTime: [''],
  });
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private timerService: TimerService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  async editTimer() {
    if (this.timerForm.valid) {
      this.submitting = true;
      const updatedTimerData = this.timerForm.value;
      const boardId = this.data;
      const timerDocRef = doc(
        db,
        'timers',
        this.timerService.getTimerId(boardId)!
      );
      await updateDoc(timerDocRef, {
        startTime: updatedTimerData.startTime,
        endTime: updatedTimerData.endTime,
      });
      this.dialogService.close();
      this.timerForm.reset();
      this.submitting = false;
    }
  }
}
