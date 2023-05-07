import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManufacturingOrdersListComponent } from './manufacturing-orders-list/manufacturing-orders-list.component';
import { MenuGuard } from 'src/guards/menu.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ManufacturingOrdersListComponent,
    canActivate: [MenuGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufacturingOrdersRoutingModule {}
