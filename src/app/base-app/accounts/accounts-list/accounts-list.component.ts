import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../account.service';
import { SelectionModel } from '@angular/cdk/collections';
import { RoleEnum, User } from '../models/user';
import { AccountFormDialogComponent } from '../account-form-dialog/account-form-dialog.component';
import { CustomConfirmDialogComponent } from 'src/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/shared/services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  selectedAccount?: User;
  accounts: User[] = [];
  displayedColumns: string[] = [/*'select',*/ 'LastName', 'FirstName', 'Email', 'Role', 'IsDisabled', 'actions'];
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

  constructor(
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

  manageAccount(action: string, user?: User) {
    this.selectedAccount = user;
    const dialogRef = this._matDialog.open(AccountFormDialogComponent, {
      panelClass: 'user-form-dialog',
      data: { action: action, user: this.selectedAccount },
      height: "95%",
      position: { right: '40px', top: '20px' }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getAccounts();
      }
    });
  }

  changeAccountStatus(user: User) {
    const newStatus = !user.isDisabled
    this.accountService.changeAccountStatus(newStatus, user.id).subscribe(() => {
    }, (err) => {
      console.log(err);
    });
  }

  deleteAccount(user: User): void {
    const dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression Compte',
        message: 'Etes-vous sûr de vouloir de supprimer ce compte ?',
        color: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      } else {
        this.loaderService.start();
        this.accountService.deleteAccount(user.id).subscribe(() => {
          this.loaderService.stop();
          this.notificationService.showSuccess('Utilisateur supprimé avec succés');
          this.getAccounts();
        }, (err) => {
          this.loaderService.stop();
          this.notificationService.showStandarError();
          console.log(err);
        });
      }
    });
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

  getAccountRole(role: number) {
    let result = '';
    switch (role) {
      case RoleEnum.SuperAdmin:
        result = 'Super Admin'
        break;
      case RoleEnum.Admin:
        result = 'Admin'
        break;
      case RoleEnum.Collaborator:
        result = 'Collaborateur'
        break;

      default:
        break;
    }
    return result;
  }

}
