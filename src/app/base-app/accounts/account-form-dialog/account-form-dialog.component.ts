import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleEnum, User } from '../models/user';
import { AccountService } from '../account.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'account-form-dialog',
  templateUrl: './account-form-dialog.component.html',
  styleUrls: ['./account-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountFormDialogComponent implements OnInit {
  user: User;
  mode: string = 'new';
  roles = [
    {
      name: 'Collaborateur',
      value: RoleEnum.Collaborator
    },
    {
      name: 'Admin',
      value: RoleEnum.Admin
    },
    {
      name: 'Super Admin',
      value: RoleEnum.SuperAdmin
    },
  ];

  passwordRegex = '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<AccountFormDialogComponent>,
    private accountService: AccountService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService) {
    this.user = new User();
    if (this.data?.action === 'edit') {
      this.mode = this.data.action;
      this.user = { ...this.data.user };
    } else if (this.data?.action === 'new') {
      this.mode = this.data.action;
      this.user = new User();
      this.user.role = this.roles[0].value;
    }
  }

  ngOnInit() {
  }

  manageAccount() {
    if (this.mode == 'new') {
      this.createAccount();
    } else {
      this.updateAccount();
    }
  }

  createAccount() {
    this.loaderService.start();
    this.accountService.createAccount(this.user).subscribe(() => {
      this.loaderService.stop();
      this.notificationService.showSuccess('Utilisateur ajouté avec succés');
      this.matDialogRef.close({ action: 'new' });
    }, err => {
      this.loaderService.stop();
      this.notificationService.showStandarError();
      console.log('Error', err);
    });
  }

  updateAccount() {
    this.loaderService.start();
    this.accountService.updateAccount(this.user).subscribe(() => {
      this.loaderService.stop();
      this.notificationService.showSuccess('Utilisateur modifié avec succés');
      this.matDialogRef.close({ action: 'new' });
    }, err => {
      this.loaderService.stop();
      this.notificationService.showStandarError();
      console.log('Error', err);
    });
  }

}
