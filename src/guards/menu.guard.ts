import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable } from 'rxjs';
import { AccountService } from 'src/app/base-app/accounts/account.service';
import { childRoutes } from 'src/app/base-app/child-routes';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MenuGuard  {
    routes = childRoutes;
    menu: any[] = [];

    constructor
        (public accountSerivice: AccountService,
            public oidcSecurityService: OidcSecurityService,
            public router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.oidcSecurityService.checkAuth()
            .pipe(
                map(({ isAuthenticated, userData, accessToken, idToken }) => {
                    this.menu = userData[`${environment.baseUrl}/user_metadata`].menu;
                    let path = next.data;
                    const found = this.menu?.find(m => m.Name == path['name']);
                    if (found == undefined) {
                        this.router.navigateByUrl('/');
                        return false;
                    } else {
                        return true;
                    }
                })
            )
    }
}
