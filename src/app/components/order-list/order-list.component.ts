import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { combineLatest, startWith, map } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderAddComponent } from '../order-add/order-add.component';
import { Order } from 'src/app/interfaces/order';
import { OrderEditComponent } from '../order-edit/order-edit.component';
import { OrderDeleteComponent } from '../order-delete/order-delete.component';
import { MenuService } from 'src/app/services/menu.service';
import { Menu } from 'src/app/interfaces/menu';
import { OrderSplitComponent } from '../order-split/order-split.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styles: [],
})
export class OrderListComponent {
  menu: Menu[] = [];
  orders$ = this.orderService.orders$;
  displayedColumns: string[] = [
    'id',
    'name',
    'items',
    'totalAmount',
    'payment',
    'date',
    'comment',
    'actions',
  ];

  displayedColumns2: string[] = ['name', 'price', 'quantity'];

  searchForm = this.fb.group({
    name: [''],
    startDate: [''],
    endDate: [''],
    payment: [''],
  });

  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.menuService.menu$.subscribe((menu) => (this.menu = menu));
    this.orders$ = combineLatest([
      this.orderService.orders$,
      this.searchForm.valueChanges.pipe(startWith(this.searchForm.value)),
    ]).pipe(
      map(([orders, searchFormValue]) => {
        const filteredOrders = orders.filter((order) => {
          const nameCondition =
            !searchFormValue.name ||
            order.customer
              .toLowerCase()
              .includes(searchFormValue.name.toLowerCase());

          const date = new Date(order.created.toDate());
          const startDate = new Date(searchFormValue.startDate!);
          const endDate = new Date(searchFormValue.endDate!);
          endDate.setHours(23, 59, 59, 999);

          const dateCondition =
            !searchFormValue.startDate ||
            !searchFormValue.endDate ||
            (date >= startDate && date <= endDate);

          const paymentCondition =
            !searchFormValue.payment ||
            order.payment === searchFormValue.payment;

          return nameCondition && dateCondition && paymentCondition;
        });
        return filteredOrders;
      })
    );
  }

  addOrder() {
    this.dialogService.open(OrderAddComponent, null);
  }

  splitOrder() {
    this.dialogService.open(OrderSplitComponent, null);
  }

  editOrder(order: Order) {
    this.dialogService.open(OrderEditComponent, order);
  }

  deleteOrder(orderId: string) {
    this.dialogService.open(OrderDeleteComponent, orderId);
  }

  calculatePrice(item: { name: string; quantity: number }) {
    const newItem = this.menu.find((x) => x.name === item.name);
    if (newItem) {
      return newItem.price;
    }
    return 0;
  }
}
