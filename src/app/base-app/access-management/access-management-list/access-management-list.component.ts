import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/shared/services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { User } from '../../accounts/models/user';
import { AccountService } from '../../accounts/account.service';
import { ApplicationSettingsService } from 'src/shared/services/appSettings.service';
import { MenuItem } from 'src/shared/models/appSettings.model';
import { AccessManagementService } from '../access-management.service';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-access-management-list',
  templateUrl: './access-management-list.component.html',
  styleUrls: ['./access-management-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccessManagementListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  selectedAccount?: User;
  accounts: User[] = [];
  displayedColumns: string[] = ['LastName', 'FirstName', 'Email'];
  selection: SelectionModel<User>;
  dataSource = new MatTableDataSource<User>();
  page = 1;
  pageSize = 10;
  length = 0;
  pageSizeOptions = [5, 10, 25, 100];
  sortBy = ''
  sortDirection = 'desc';
  searchInput = '';
  currentUser!: any;
  menu!: MenuItem[];

  constructor(
    private applicationSettingsService: ApplicationSettingsService,
    private accessManagementService: AccessManagementService,
    private accountService: AccountService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService,
    public _matDialog: MatDialog,
    public oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.checkAuth()
      .subscribe(({ isAuthenticated, userData, accessToken, idToken }) => {
        this.currentUser = userData;
      });
    this.selection = new SelectionModel<User>(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getMenu();
    this.getAccounts();
  }

  getAccounts(): void {
    this.loaderService.startBackground();
    this.accountService.getPaginatedAccounts(this.page, this.pageSize, this.sortBy, this.sortDirection, this.searchInput)
      .subscribe({
        next: (response) => {
          this.loaderService.stopAll();
          this.accounts = response.data;
          this.dataSource = new MatTableDataSource<User>(this.accounts);
          this.length = response.totalCount;
        },
        error: (err) => {
          this.notificationService.showStandarError();
          this.loaderService.stopAll();
        }
      })
  }

  getMenu() {
    this.applicationSettingsService.getMenu().subscribe({
      next: (data) => {
        this.menu = data.menu;
        const column = this.menu.map(i => i.title);
        this.displayedColumns = this.displayedColumns.concat(column);
      },
      error: () => {

      }
    })
  }

  updateAccess(user: User, item: any, event: any) {
    const data = {
      userId: user.id,
      access:event.checked,
      itemMenu: item.name
    }

    this.accessManagementService.updateAccessMenu(data).subscribe(() => {
    }, (err) => {
      console.log(err);
    });
  }

  checkAccessibility(user: User, item: any) {
    return user.menu?.find(i => i.Name == item.name) == undefined ? false : true;
  }

  pageChanged(event: any) {
    if (event.pageIndex == this.page) {
      this.page = 1;
    }
    this.page = event.pageIndex + 1
    this.pageSize = event.pageSize;
    this.getAccounts();
  }

  sortChanged(event: any) {
    this.page = 1;
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.getAccounts();
  }

}
