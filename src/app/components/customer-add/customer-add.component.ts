import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styles: [],
})
export class CustomerAddComponent {
  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.maxLength(10)]],
    sub: [false, [Validators.required]],
  });
  submitting: boolean = false;
  constructor(private fb: FormBuilder, private dialogService: DialogService) {}

  async addCustomer() {
    if (this.customerForm.valid) {
      this.submitting = true;
      const customerData = this.customerForm.value;
      await addDoc(collection(db, 'customers'), {
        name: customerData.name?.replace(/^[a-z]/, (match) =>
          match.toUpperCase()
        ),
        phone: customerData.phone,
        sub: customerData.sub,
        created: serverTimestamp(),
      });
      this.dialogService.close();
      this.customerForm.reset();
      this.submitting = false;
    }
  }
}
