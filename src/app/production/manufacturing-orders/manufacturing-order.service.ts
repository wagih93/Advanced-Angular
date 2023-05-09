import { Injectable } from '@angular/core';
import { HttpRepositoryService } from 'src/core/httpRepository.service';
import { ManufacturingOrder } from './models/manufacturing-order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManufacturingOrderService {
  private BASE_URI = 'api/manufacturingorders';

  constructor(private httpRepositoryService: HttpRepositoryService) {}

  getPaginatedManufacturingOrders(
    page: number,
    pageSize: number,
    sortBy = '',
    sortDirection = 'desc',
    search = ''
  ): Observable<any> {
    let params: any = {
      loadChildren: true,
      isFiltering: false,
      page: page,
      pageSize: pageSize,
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

  getManufacturingOrders() {
    return this.httpRepositoryService.get<ManufacturingOrder[]>(
      `${this.BASE_URI}`
    );
  }

  getManufacturingOrder(manufacturingorderId: string | null | undefined) {
    return this.httpRepositoryService.get<ManufacturingOrder>(
      `${this.BASE_URI}/${manufacturingorderId}`
    );
  }

  createManufacturingOrder(manufacturingorder?: ManufacturingOrder) {
    return this.httpRepositoryService.post<any>(
      `${this.BASE_URI}`,
      manufacturingorder
    );
  }

  updateManufacturingOrder(manufacturingorder: ManufacturingOrder) {
    return this.httpRepositoryService.put<ManufacturingOrder>(
      `${this.BASE_URI}/${manufacturingorder.id}`,
      manufacturingorder
    );
  }

  deleteManufacturingOrder(manufacturingorderId?: string) {
    return this.httpRepositoryService.delete<boolean>(
      `${this.BASE_URI}/${manufacturingorderId}`
    );
  }

  addTeamMemberToManufacturingOrder(member: any) {
    return this.httpRepositoryService.post<any>(
      `${this.BASE_URI}/add-member`,
      member
    );
  }

  removeTeamMemberFromManufacturingOrder(member: any) {
    return this.httpRepositoryService.post<any>(
      `${this.BASE_URI}/remove-member`,
      member
    );
  }
}
