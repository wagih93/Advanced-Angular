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
import { AddManufacturingOrderDialogComponent } from '../add-manufacturing-order-dialog/add-manufacturing-order-dialog.component';
import { CustomConfirmDialogComponent } from 'src/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import * as XLSX from 'xlsx';
import { Observable, from, mergeMap, of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { FileSaverService } from 'ngx-filesaver';

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

  getManufacturingOrders(): void {
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

  manageManufacturingOrder(
    action: string,
    manufacturingOrder?: ManufacturingOrder
  ) {
    this.selectedManufacturingOrder = manufacturingOrder;
    const dialogRef = this._matDialog.open(
      AddManufacturingOrderDialogComponent,
      {
        panelClass: 'manufacturingOrder-form-dialog',
        data: {
          action: action,
          manufacturingOrder: this.selectedManufacturingOrder,
        },
        height: '95%',
        position: { right: '40px', top: '20px' },
      }
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.getManufacturingOrders();
      }
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

  printData(fromSelection?: boolean): void {
    let dataToPrint: Observable<FlatManufacturingOrder[]> | null = null;
    if (fromSelection) {
      dataToPrint = this.FlattenManufacturingOrders(this.selection.selected);
    } else {
      dataToPrint = this.FlattenManufacturingOrders(this.dataSource.data);
    }

    dataToPrint.subscribe((data: FlatManufacturingOrder[]) => {
      const html = `
      <html>
        <head>
          <title>Palmary Food</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
              font-family: Arial, sans-serif;
              font-size: 0.8rem;
            }

            th, td {
              padding: 0.5rem;
              text-align: left;
              vertical-align: top;
              border: 1px solid #dee2e6;
            }

            th {
              background-color: #f5f5f5;
              font-weight: bold;
              text-transform: capitalize;
            }

            td {
              border-color: #dee2e6;
            }

            button {
              background-color: #007bff;
              border: none;
              color: #fff;
              padding: 0.5rem 1rem;
              border-radius: 0.25rem;
              cursor: pointer;
              font-size: 1rem;
              margin: 0 auto;
              display: block;
            }

            button svg {
              width: 1rem;
              height: 1rem;
              margin-right: 0.5rem;
            }

            .button-container {
              text-align: center;
              margin-bottom: 1rem;
            }

            .title {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 1rem;
            }

            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="title">${'Ordres de fabrication'}</div>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0])
                  .map(
                    (key) => `
                      <th>${key}</th>
                    `
                  )
                  .join('')}
              </tr>
            </thead>

            <tbody>
              ${Array.from(data)
                .map(
                  (data) => `
                    <tr>
                      <td>${data.Date}</td>
                      <td>${data.Lot}</td>
                      <td>${data.Produit}</td>
                      <td>${data.Ligne}</td>
                      <td>${data.Groupe}</td>
                      <td>${data.Num_Groupe}</td>
                      <td>${data.Objectif}</td>
                      <td>${data.Propriétaire}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
          <div class="button-container">
          <button onclick="window.print()"><svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4H4V0H16V4ZM16 9.5C16.2833 9.5 16.521 9.404 16.713 9.212C16.905 9.02 17.0007 8.78267 17 8.5C17 8.21667 16.904 7.979 16.712 7.787C16.52 7.595 16.2827 7.49933 16 7.5C15.7167 7.5 15.479 7.596 15.287 7.788C15.095 7.98 14.9993 8.21733 15 8.5C15 8.78333 15.096 9.021 15.288 9.213C15.48 9.405 15.7173 9.50067 16 9.5ZM14 16V12H6V16H14ZM16 18H4V14H0V8C0 7.15 0.291667 6.43733 0.875 5.862C1.45833 5.28667 2.16667 4.99933 3 5H17C17.85 5 18.5627 5.28767 19.138 5.863C19.7133 6.43833 20.0007 7.15067 20 8V14H16V18Z" fill="white"/>
          </svg>
           Print</button>
          </div>
        </body>
      </html>
    `;
      const popup = window.open();
      if (popup) {
        popup.document.write(html);
        popup.document.close();
      }
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
}
