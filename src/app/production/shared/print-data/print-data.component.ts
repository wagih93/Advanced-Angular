import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-print-data',
  templateUrl: './print-data.component.html',
  styleUrls: ['./print-data.component.scss'],
})
export class PrintDataComponent {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<PrintDataComponent>
  ) {
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.displayedColumns = Object.keys(this.data[0]).map((key) => key);
    console.log(this.displayedColumns);
  }
}
