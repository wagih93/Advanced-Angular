import { NgxPrintModule } from 'ngx-print';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintDataComponent } from './print-data/print-data.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [PrintDataComponent],
  imports: [
    CommonModule,
    MatTableModule,
    NgxPrintModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
})
export class PrintDataModule {}
