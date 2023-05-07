import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuGuard } from 'src/guards/menu.guard';
import { AccessManagementListComponent } from './access-management-list/access-management-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: AccessManagementListComponent,
    canActivate: [MenuGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessManagementRoutingModule { }
