import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FlatManufacturingOrder,
  ManufacturingOrder,
} from '../models/manufacturing-order';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ManufacturingOrderService } from '../manufacturing-order.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CustomConfirmDialogComponent } from 'src/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import * as XLSX from 'xlsx';
import { Observable, from, mergeMap, of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { FileSaverService } from 'ngx-filesaver';
import { PrintDataComponent } from '../../shared/print-data/print-data.component';
import { ManufacturingOrderDetailsComponent } from '../manufacturing-order-details/manufacturing-order-details.component';

@Component({
  selector: 'app-manufacturing-orders-list',
  templateUrl: './manufacturing-orders-list.component.html',
  styleUrls: ['./manufacturing-orders-list.component.scss'],
})
export class ManufacturingOrdersListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  selectedManufacturingOrder?: ManufacturingOrder;
  manufacturingorders: ManufacturingOrder[] = [];
  selection = new SelectionModel<ManufacturingOrder>(true, []);
  displayedColumns: string[] = [
    'select',
    'Created',
    'BatchNumber',
    'Product.Name',
    'ProductionLine.Name',
    'Team.Name',
    'Team.Number',
    'Quantity',
    'Owner.Name',
    'actions',
  ];
  noSelection: boolean = true;
  dataSource = new MatTableDataSource<ManufacturingOrder>();
  page = 1;
  pageSize = 10;
  length = 0;
  pageSizeOptions = [5, 10, 25, 100];
  sortBy = '';
  sortDirection = '';
  searchInput = '';
  currentUser!: any;
  datePipe = new DatePipe('en-US');

  constructor(
    private manufacturingorderService: ManufacturingOrderService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService,
    public _matDialog: MatDialog,
    public oidcSecurityService: OidcSecurityService,
    private fileSaverService: FileSaverService
  ) {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData, accessToken, idToken }) => {
        this.currentUser = userData;
      });
    this.selection = new SelectionModel<ManufacturingOrder>(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getManufacturingOrders();
  }

  getManufacturingOrders(isSearch?: boolean): void {
    if (isSearch) {
      this.page = 1;
    }
    this.loaderService.startBackground();
    this.manufacturingorderService
      .getPaginatedManufacturingOrders(
        this.page,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
        this.searchInput
      )
      .subscribe({
        next: (response) => {
          this.loaderService.stopAll();
          this.manufacturingorders = response.data;
          this.dataSource = new MatTableDataSource<ManufacturingOrder>(
            this.manufacturingorders
          );
          const itemsToAdd = this.manufacturingorders.filter((item) => {
            const foundItem = this.selection.selected.find(
              (selectedItem) => selectedItem.id === item.id
            );
            if (!foundItem) return;
            // removes item from selection
            this.selection.deselect(foundItem);
            return item;
          });
          this.selection.select(...itemsToAdd);

          this.length = response.totalCount;
        },
        error: (err) => {
          this.notificationService.showStandarError();
          this.loaderService.stopAll();
        },
      });
  }

  deleteManufacturingOrder(manufacturingOrder: ManufacturingOrder): void {
    const dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression Compte',
        message: 'Etes-vous sûr de vouloir de supprimer ce compte ?',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (!response) {
        return;
      }
      this.loaderService.start();
      this.manufacturingorderService
        .deleteManufacturingOrder(manufacturingOrder.id)
        .subscribe({
          next: () => {
            this.loaderService.stop();
            this.notificationService.showSuccess('OF supprimé avec succés');
            this.getManufacturingOrders();
          },
          error: (err) => {
            this.loaderService.stop();
            this.notificationService.showStandarError();
            console.log(err);
          },
        });
    });
  }

  pageChanged(event: any) {
    if (event.pageIndex == this.page) {
      this.page = 1;
    }
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getManufacturingOrders();
  }

  sortChanged(event: any) {
    this.page = 1;
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.getManufacturingOrders();
  }

  checkSelection() {
    this.selection.selected.length > 0
      ? (this.noSelection = false)
      : (this.noSelection = true);
  }
  FlattenManufacturingOrders(
    data: ManufacturingOrder[]
  ): Observable<FlatManufacturingOrder[]> {
    // Flattening the nested data
    return from(data).pipe(
      mergeMap((element) => {
        return [
          {
            Date: this.datePipe.transform(element.created, 'yyyy-MM-dd hh:mm'),
            Lot: element.batchNumber,
            Produit: element.product.name,
            Ligne: element.productionLine.name,
            Groupe: element.team.name,
            Num_Groupe: element.team.number,
            Objectif: element.quantity,
            Propriétaire: element.owner.name,
          },
        ];
      }),
      toArray()
    );
  }
  exportData(fromSelection?: boolean): Promise<Blob> {
    let dataToExport: Observable<FlatManufacturingOrder[]> | null = null;
    if (fromSelection) {
      dataToExport = this.FlattenManufacturingOrders(this.selection.selected);
    } else {
      dataToExport = this.FlattenManufacturingOrders(this.dataSource.data);
    }

    return new Promise((resolve, reject) => {
      if (dataToExport) {
        dataToExport.subscribe((data: FlatManufacturingOrder[]) => {
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          const excelBlob: Blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
          });

          resolve(excelBlob);
        });
      }
    });
  }
  saveExcel(fromSelection?: boolean): void {
    this.exportData(fromSelection).then((excelBlob: Blob) => {
      // Open a file dialog to let the user choose where to save the file
      const fileName = `${this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd_hhmmssms'
      )}.xlsx`;
      const fileType = excelBlob.type;
      this.fileSaverService.save(excelBlob, fileName, fileType);
    });
  }
  OpenPrintDialog(flatManufacturingOrder?: FlatManufacturingOrder[]) {
    const dialogRef = this._matDialog.open(PrintDataComponent, {
      data: flatManufacturingOrder,
      height: '95%',
      autoFocus: false,
    });
  }
  printData(fromSelection?: boolean): void {
    let dataToPrint: Observable<FlatManufacturingOrder[]> | null = null;
    if (fromSelection) {
      dataToPrint = this.FlattenManufacturingOrders(this.selection.selected);
    } else {
      dataToPrint = this.FlattenManufacturingOrders(this.dataSource.data);
    }

    dataToPrint.subscribe((data: FlatManufacturingOrder[]) => {
      this.OpenPrintDialog(data);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ManufacturingOrder): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }
  onFilterButtonClicked(event: Event) {
    event.stopPropagation();
    // Implement your filter logic here
  }

  manufacturingOrderDetails(manufacturingOrder?: ManufacturingOrder): void {
    const dialogRef = this._matDialog.open(ManufacturingOrderDetailsComponent, {
      data: manufacturingOrder,
      width: '50%',
      autoFocus: false,
    });
  }
}
