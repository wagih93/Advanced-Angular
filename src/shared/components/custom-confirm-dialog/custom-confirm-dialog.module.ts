import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomConfirmDialogComponent } from './custom-confirm-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    CustomConfirmDialogComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  exports: [
    CustomConfirmDialogComponent
  ]
})
export class CustomConfirmDialogModule {
}
