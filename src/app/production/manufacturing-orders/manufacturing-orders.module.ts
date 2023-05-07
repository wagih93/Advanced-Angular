import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufacturingOrdersRoutingModule } from './manufacturing-orders-routing.module';
import { ManufacturingOrdersListComponent } from './manufacturing-orders-list/manufacturing-orders-list.component';
import { AddManufacturingOrderDialogComponent } from './add-manufacturing-order-dialog/add-manufacturing-order-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CustomConfirmDialogModule } from 'src/shared/components/custom-confirm-dialog/custom-confirm-dialog.module';
import { AnimationsModule } from 'src/shared/modules/animation.module';

@NgModule({
  declarations: [
    ManufacturingOrdersListComponent,
    AddManufacturingOrderDialogComponent,
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
    MatSelectModule,
    MatToolbarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatTooltipModule,
    MatCardModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    CustomConfirmDialogModule,
    AnimationsModule,
  ],
})
export class ManufacturingOrdersModule {}
