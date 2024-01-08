import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardListComponent } from './components/board-list/board-list.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { BookingListComponent } from './components/booking-list/booking-list.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BillComponent } from './components/bill/bill.component';

const title = 'White Noise · Cafe & Snooker Hub';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: `Dashboard - ${title}`,
  },
  { path: 'boards', component: BoardListComponent, title: `Boards - ${title}` },
  { path: 'menu', component: MenuListComponent, title: `Menu - ${title}` },
  {
    path: 'customers',
    component: CustomerListComponent,
    title: `Customers - ${title}`,
  },
  {
    path: 'bookings',
    component: BookingListComponent,
    title: `Bookings - ${title}`,
  },
  {
    path: 'orders',
    component: OrderListComponent,
    title: `Orders - ${title}`,
  },
  {
    path: 'games',
    component: GameListComponent,
    title: `Games - ${title}`,
  },
  {
    path: 'bill',
    component: BillComponent,
    title: `Bill - ${title}`,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
