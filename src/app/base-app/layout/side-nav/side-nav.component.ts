import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../accounts/account.service';
import { childRoutes } from '../../child-routes';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavComponent implements OnInit {
  showMenu = false;
  routes = childRoutes;
  isAdmin: boolean = true;
  menu: any[] = [];

  constructor(
    public accountSerivice: AccountService,
    public oidcSecurityService: OidcSecurityService,
  ) {
    this.getMenu();
  }

  ngOnInit() { }

  getMenu() {
    this.oidcSecurityService.checkAuth().
      subscribe(({ isAuthenticated, userData, accessToken, idToken }) => {
        this.accountSerivice.connectedUser.next(userData);
        this.menu = userData[`${environment.baseUrl}/user_metadata`].menu;
        this.routes.forEach(route => {
          let item = this.menu?.find(i => i.Name == route.data.name);
          if (item != null) {
            route.data.show = true;
          }
        });
        this.showMenu = true;
      })
  }

}
