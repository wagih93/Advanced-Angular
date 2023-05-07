import { Injectable } from '@angular/core';
import { User } from './models/user';
import { HttpRepositoryService } from 'src/core/httpRepository.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  connectedUser: BehaviorSubject<User> = new BehaviorSubject<any>(null);

  private BASE_URI = 'api/users';

  constructor(private httpRepositoryService: HttpRepositoryService) { }

  getPaginatedAccounts(page: number, pageSize: number, sortBy = '', sortDirection = 'desc', search = ''): Observable<any> {
    let params: any = {
      page: page,
      pageSize: pageSize
    };

    if (sortBy) {
      params['sortBy'] = sortBy;
    }

    if (sortDirection) {
      params['sortDirection'] = sortDirection;
    }

    if (search) {
      params['search'] = search;
    }

    return this.httpRepositoryService.get(this.BASE_URI, params);
  }

  getAccounts() {
    return this.httpRepositoryService.get<any>(`${this.BASE_URI}`);
  }

  searchAccount(searchInput: string) {
    let params: any = {
      search: searchInput,
    };

    if (searchInput) {
      params['search'] = searchInput;
    }
    return this.httpRepositoryService.get<any>(`${this.BASE_URI}/search-user`, params);
  }

  createAccount(account?: User) {
    return this.httpRepositoryService.post<any>(`${this.BASE_URI}`, account);
  }

  updateAccount(account: User) {
    return this.httpRepositoryService.put<User>(`${this.BASE_URI}/${account.id}`, account);
  }

  changeAccountStatus(status: boolean, accountId?: string) {
    return this.httpRepositoryService.get<boolean>(`${this.BASE_URI}/change-account-status/${accountId}/${status}`);
  }

  deleteAccount(accountId?: string) {
    return this.httpRepositoryService.delete<boolean>(`${this.BASE_URI}/${accountId}`);
  }

}
