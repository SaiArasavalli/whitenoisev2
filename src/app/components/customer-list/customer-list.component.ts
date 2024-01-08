import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CustomerAddComponent } from '../customer-add/customer-add.component';
import { Customer } from 'src/app/interfaces/customer';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { CustomerDeleteComponent } from '../customer-delete/customer-delete.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styles: [],
})
export class CustomerListComponent {
  customers$ = this.customerService.customers$;
  searchForm = this.fb.group({
    name: [''],
  });
  displayedColumns: string[] = ['id', 'name', 'sub', 'phone', 'actions'];

  constructor(
    private customerService: CustomerService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.searchForm.get('name')?.valueChanges.subscribe(() => {
      this.filterCustomers();
    });
  }

  filterCustomers() {
    const searchTerm = this.searchForm.get('name')?.value?.toLowerCase();
    if (!searchTerm) {
      this.customers$ = this.customerService.customers$;
    } else {
      this.customers$ = this.customerService.customers$.pipe(
        map((customers) =>
          customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm)
          )
        )
      );
    }
  }

  addCustomer() {
    this.dialogService.open(CustomerAddComponent, null);
  }

  editCustomer(customer: Customer) {
    this.dialogService.open(CustomerEditComponent, customer);
  }

  deleteCustomer(customerId: string) {
    this.dialogService.open(CustomerDeleteComponent, customerId);
  }
}
