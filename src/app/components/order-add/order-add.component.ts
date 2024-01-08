import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { Menu } from 'src/app/interfaces/menu';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styles: [],
})
export class OrderAddComponent {
  submitting: boolean = false;
  menu: Menu[] = [];
  customers: Customer[] = [];
  orderForm = this.fb.group({
    customer: ['', [Validators.required]],
    items: this.fb.array([], Validators.required),
    payment: ['PENDING', [Validators.required]],
    comment: [''],
    created: [new Date().toISOString()],
  });

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private menuService: MenuService,
    private customerService: CustomerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
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

  async addOrder() {
    if (this.orderForm.valid) {
      this.submitting = true;
      const orderData = this.orderForm.value;
      const totalAmount = this.calculateTotalAmount();
      await addDoc(collection(db, 'orders'), {
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
