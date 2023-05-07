import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuGuard } from 'src/guards/menu.guard';
import { AccountListComponent } from './accounts-list/accounts-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: AccountListComponent,
    canActivate: [MenuGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
