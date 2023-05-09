import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manufacturing-order-details',
  templateUrl: './manufacturing-order-details.component.html',
  styleUrls: ['./manufacturing-order-details.component.scss'],
})
export class ManufacturingOrderDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<ManufacturingOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onDialogClose(): void {
    this.dialogRef.close();
  }
}
