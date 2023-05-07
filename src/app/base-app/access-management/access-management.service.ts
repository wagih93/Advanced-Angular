import { Injectable } from '@angular/core';
import { HttpRepositoryService } from 'src/core/httpRepository.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessManagementService {
  private BASE_URI = 'api/accessManagement';

  constructor(private httpRepositoryService: HttpRepositoryService) { }

  updateAccessMenu(data: any) {
    return this.httpRepositoryService.post<any>(`${this.BASE_URI}/update-user-access-menu`, data);
  }

}
