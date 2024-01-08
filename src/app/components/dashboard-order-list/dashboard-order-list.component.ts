import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { combineLatest, startWith, map } from 'rxjs';
import { Menu } from 'src/app/interfaces/menu';
import { Order } from 'src/app/interfaces/order';
import { DialogService } from 'src/app/services/dialog.service';
import { MenuService } from 'src/app/services/menu.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderAddComponent } from '../order-add/order-add.component';
import { OrderDeleteComponent } from '../order-delete/order-delete.component';
import { OrderEditComponent } from '../order-edit/order-edit.component';
import { OrderSplitComponent } from '../order-split/order-split.component';

@Component({
  selector: 'app-dashboard-order-list',
  templateUrl: './dashboard-order-list.component.html',
  styles: [],
})
export class DashboardOrderListComponent {
  menu: Menu[] = [];
  orders: Order[] = [];
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
    const today = new Date();
    this.orderService.orders$.subscribe((updatedOrders) => {
      const todayOrders = updatedOrders.filter((order) => {
        const orderDate = order.created.toDate();

        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });
      this.orders = todayOrders;
    });
    this.menuService.menu$.subscribe((menu) => (this.menu = menu));
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
