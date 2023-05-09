import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturingOrdersRoutingModule } from './manufacturing-orders-routing.module';
import { ManufacturingOrdersListComponent } from './manufacturing-orders-list/manufacturing-orders-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CustomConfirmDialogModule } from 'src/shared/components/custom-confirm-dialog/custom-confirm-dialog.module';
import { AnimationsModule } from 'src/shared/modules/animation.module';
import { PrintDataModule } from '../shared/print-data.module';
import { ManufacturingOrderDetailsComponent } from './manufacturing-order-details/manufacturing-order-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ManufacturingOrdersListComponent,
    ManufacturingOrderDetailsComponent,
  ],
  imports: [
    CommonModule,
    ManufacturingOrdersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    CustomConfirmDialogModule,
    AnimationsModule,
    PrintDataModule,
    MatTooltipModule,
  ],
})
export class ManufacturingOrdersModule {}
