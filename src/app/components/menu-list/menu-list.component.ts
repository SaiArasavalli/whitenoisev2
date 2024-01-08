import { Component } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { MenuService } from 'src/app/services/menu.service';
import { MenuAddComponent } from '../menu-add/menu-add.component';
import { Menu } from 'src/app/interfaces/menu';
import { MenuEditComponent } from '../menu-edit/menu-edit.component';
import { MenuDeleteComponent } from '../menu-delete/menu-delete.component';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styles: [],
})
export class MenuListComponent {
  menu$ = this.menuService.menu$;
  searchForm = this.fb.group({
    name: [''],
  });
  displayedColumns: string[] = ['id', 'name', 'price', 'actions'];

  constructor(
    private menuService: MenuService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.searchForm.get('name')?.valueChanges.subscribe(() => {
      this.filterMenu();
    });
  }

  filterMenu() {
    const searchTerm = this.searchForm.get('name')?.value?.toLowerCase();
    if (!searchTerm) {
      this.menu$ = this.menuService.menu$;
    } else {
      // Filter the menu based on the search term
      this.menu$ = this.menuService.menu$.pipe(
        map((menu) =>
          menu.filter((item) => item.name.toLowerCase().includes(searchTerm))
        )
      );
    }
  }

  addItem() {
    this.dialogService.open(MenuAddComponent, null);
  }

  editItem(item: Menu) {
    this.dialogService.open(MenuEditComponent, item);
  }

  deleteItem(itemId: string) {
    this.dialogService.open(MenuDeleteComponent, itemId);
  }
}
