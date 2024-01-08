import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { Menu } from 'src/app/interfaces/menu';
import { Order } from 'src/app/interfaces/order';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styles: [],
})
export class OrderEditComponent {
  orderForm = this.fb.group({
    customer: ['', [Validators.required]],
    items: this.fb.array([], Validators.required),
    payment: ['PENDING', [Validators.required]],
    comment: [''],
    created: [this.data.created.toDate().toISOString()],
  });
  submitting: boolean = false;
  menu: Menu[] = [];
  customers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private menuService: MenuService,
    private customerService: CustomerService,
    private datePipe: DatePipe,

    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {}

  ngOnInit() {
    const orderData = {
      customer: this.data.customer,
      items: this.data.items,
      payment: this.data.payment,
      comment: this.data.comment,
    };
    this.orderForm.patchValue(orderData);
    this.setFormItems(this.data.items);
    this.menuService.menu$.subscribe(
      (menu) => (this.menu = this.sortMenuByName(menu))
    );
    this.customerService.customers$.subscribe(
      (customers) => (this.customers = this.sortCustomersByName(customers))
    );
  }

  private sortCustomersByName(customers: Customer[]): Customer[] {
    return customers.sort((a, b) => a.name.localeCompare(b.name));
  }

  private sortMenuByName(menu: Menu[]): Menu[] {
    return menu.sort((a, b) => a.name.localeCompare(b.name));
  }

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  setFormItems(items: any[]) {
    items.forEach((item) => {
      this.items.push(this.fb.group(item));
    });
  }

  addItem() {
    this.items.push(this.fb.group({ name: [''], quantity: [1] }));
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let sum = 0;
    if (this.items.value.length !== 0) {
      this.items.value.forEach((item: { name: string; quantity: number }) => {
        const newItem = this.menu.find((itemObj) => itemObj.name === item.name);
        if (newItem) {
          sum += newItem.price * item.quantity;
        }
      });
    }
    return sum;
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotalAmount();
  }

  async editOrder() {
    if (this.orderForm.valid) {
      this.submitting = true;
      const orderData = this.orderForm.value;
      const orderId = this.data.id;
      const totalAmount = this.calculateTotalAmount();
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        customer: orderData.customer,
        items: orderData.items,
        totalAmount: totalAmount,
        payment: orderData.payment,
        comment: orderData.comment,
        created: Timestamp.fromDate(new Date(orderData.created!)),
      });
      this.dialogService.close();
      this.orderForm.reset();
      this.submitting = false;
    }
  }
}
