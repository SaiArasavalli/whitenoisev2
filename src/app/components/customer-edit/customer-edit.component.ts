import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styles: [],
})
export class CustomerEditComponent {
  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.maxLength(10)]],
    sub: [false, [Validators.required]],
  });
  submitting: boolean = false;
  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {}

  ngOnInit() {
    this.customerForm.patchValue(this.data);
  }

  async editCustomer() {
    if (this.customerForm.valid) {
      this.submitting = true;
      const updatedCustomerData = this.customerForm.value;
      const customerId = this.data.id;
      const customerDocRef = doc(db, 'customers', customerId);
      await updateDoc(customerDocRef, {
        name: updatedCustomerData.name,
        phone: updatedCustomerData.phone,
        sub: updatedCustomerData.sub,
      });
      this.dialogService.close();
      this.customerForm.reset();
      this.submitting = false;
    }
  }
}
