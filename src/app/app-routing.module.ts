import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dasboard', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./base-app/base-app.module').then((m) => m.BaseAppModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
