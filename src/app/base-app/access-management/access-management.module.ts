import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AccessManagementRoutingModule } from './access-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { CustomConfirmDialogModule } from 'src/shared/components/custom-confirm-dialog/custom-confirm-dialog.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AccessManagementListComponent } from './access-management-list/access-management-list.component';
import { AnimationsModule } from 'src/shared/modules/animation.module';


@NgModule({
  declarations: [
    AccessManagementListComponent,
  ],
  imports: [
    AccessManagementRoutingModule,
    CommonModule,
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
    AnimationsModule
  ]
})
export class AccessManagementModule { }
