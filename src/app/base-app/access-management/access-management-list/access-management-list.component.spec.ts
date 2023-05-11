import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessManagementListComponent } from './access-management-list.component';
import { ApplicationSettingsService } from 'src/shared/services/appSettings.service';
import { AccessManagementService } from '../access-management.service';
import { AccountService } from '../../accounts/account.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { MockService } from 'ng-mocks';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AccessManagementModule } from '../access-management.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AccessManagementListComponent', () => {
  let component: AccessManagementListComponent;
  let fixture: ComponentFixture<AccessManagementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,NoopAnimationsModule,AccessManagementModule],
      declarations: [ AccessManagementListComponent ],
      providers:[
          ApplicationSettingsService,
          AccessManagementService,
          AccountService,
        
          NotificationService,
          NgxUiLoaderService,
          {provide:ToastrService,useValue:MockService(ToastrService)},
          {provide:OidcSecurityService,useFactory:()=>{
              let service = MockService(OidcSecurityService);
              service.checkAuth = jest.fn(()=>of({
                accessToken:'',
                configId:'',
                idToken:'',
                isAuthenticated:true,
                userData:{},
                errorMessage:undefined
              } as LoginResponse))
              return service;
            }
          },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
