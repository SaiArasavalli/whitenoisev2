import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Menu } from 'src/app/interfaces/menu';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styles: [],
})
export class MenuEditComponent {
  menuForm = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required]],
  });
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: Menu
  ) {}

  ngOnInit() {
    this.menuForm.patchValue(this.data);
  }

  async editItem() {
    if (this.menuForm.valid) {
      this.submitting = true;
      const updatedMenuData = this.menuForm.value;
      const itemId = this.data.id;
      const menuDocRef = doc(db, 'menu', itemId);
      await updateDoc(menuDocRef, {
        name: updatedMenuData.name,
        price: Number(updatedMenuData.price),
      });
      this.dialogService.close();
      this.menuForm.reset();
      this.submitting = false;
    }
  }
}
