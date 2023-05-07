import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime, delay, distinctUntilChanged, filter, map, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { AccountService } from 'src/app/base-app/accounts/account.service';
import { User } from 'src/app/base-app/accounts/models/user';
import { ProjectTask, StatusColumn } from '../../models/project';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskDetailsComponent implements OnInit {
  @ViewChild('matRef') matRef!: MatSelect;

  task!: ProjectTask;
  projectId!: string;
  statusColumns!: StatusColumn[];
  taskChanged = false;

  public userServerSideCtrl: FormControl<any> = new FormControl<any>(null);
  public userServerSideFilteringCtrl: FormControl<any> = new FormControl<string>('');
  public searching = false;
  public filteredServerSideUsers: any = new ReplaySubject<any[]>(1);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<TaskDetailsComponent>,
    public matDialog: MatDialog,
    private projectService: ProjectService,
    private loaderService: NgxUiLoaderService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.task = this.data.task;
    this.projectId = this.data.projectId;
    if (this.task.assignedTo) {
      this.filteredServerSideUsers.next([this.task.assignedTo]);
      this.userServerSideCtrl.setValue(this.task.assignedTo.id);  
    }
    
    this.statusColumns = this.data.statusColumns;
    this.userServerSideFilteringCtrl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => this.accountService.searchAccount(term))
    ).subscribe(results => {
      this.searching = false;
      this.filteredServerSideUsers.next(results);
    }, err => {
      this.searching = false;
    });
  }

  clear(event:any) {
    this.matRef.options.forEach((data: MatOption) => data.deselect());
    event.stopPropagation();
  }

  updateTask() {
    this.loaderService.start();
    let updatedTask = {
      projectId: this.projectId,
      taskId: this.task.id,
      name: this.task.name,
      description: this.task.description,
      status: this.statusColumns.find(s => s.id == this.task.status.id),
      assignedTo: this.userServerSideCtrl.value,
    }
    this.projectService.updateTask(updatedTask).subscribe({
      next: () => {
        this.loaderService.stop();
        this.taskChanged = true;
        this.matDialogRef.close({ taskChanged: this.taskChanged });
      },
      error: () => {
        this.loaderService.stop();
      }
    })
  }

}
