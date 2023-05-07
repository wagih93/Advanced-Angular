import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';


@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: environment.authConfig.authority,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: environment.authConfig.clientId,
        scope: environment.authConfig.scope,
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        customParamsAuthRequest: {
          audience: environment.authConfig.audience,
        },
        customParamsRefreshTokenRequest: {
          scope: environment.authConfig.scope,
        },
        secureRoutes: environment.authConfig.secureRoutes,
      },
    })],
  exports: [AuthModule],
})
export class AuthConfigModule { }