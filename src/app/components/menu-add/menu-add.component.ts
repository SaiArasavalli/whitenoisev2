import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styles: [],
})
export class MenuAddComponent {
  menuForm = this.fb.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
  });
  submitting: boolean = false;

  constructor(private fb: FormBuilder, private dialogService: DialogService) {}

  async addItem() {
    if (this.menuForm.valid) {
      this.submitting = true;
      const menuData = this.menuForm.value;
      await addDoc(collection(db, 'menu'), {
        name: menuData.name,
        price: Number(menuData.price),
        created: serverTimestamp(),
      });
      this.dialogService.close();
      this.menuForm.reset();
      this.submitting = false;
    }
  }
}
