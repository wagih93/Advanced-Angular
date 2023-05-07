import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AccountService } from './base-app/accounts/account.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'NXM.BaseApp.Front';
  isAuthenticated = false;
  icons = ['export-icon', 'print-icon', 'cross-icon', 'loop-icon','filter-icon'];
  constructor(
    public accountSerivice: AccountService,
    public oidcSecurityService: OidcSecurityService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.icons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        `${icon}`,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `../assets/icons/${icon}.svg`
        )
      );
    });

    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData, accessToken, idToken }) => {
        if (!isAuthenticated) {
          this.login();
        } else {
          console.log('current user:', userData);
          this.isAuthenticated = true;
          this.accountSerivice.connectedUser.next(userData);
        }
      });
  }

  ngOnInit() {}

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => (this.isAuthenticated = false));
  }
}
