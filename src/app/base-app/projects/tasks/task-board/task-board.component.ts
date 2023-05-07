import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomConfirmDialogComponent } from 'src/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../models/project';
import { Board } from '../../models/board.model';
import { ProjectService } from '../../project.service';
import { TaskDetailsComponent } from '../task-details/task-details.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {
  project!: Project;
  projectId!: any;
  board!: Board;
  taskId!: any;
  columnsIds!: string[];
  openNewTaskForm = false;
  taskContent!: string;
  userNotAuthorized = false;

  @ViewChild('newTaskInput') newTaskInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public matDialog: MatDialog,
    private projectService: ProjectService,
    private loaderService: NgxUiLoaderService) {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.taskId = this.route.snapshot.queryParamMap.get('taskId');
  }

  ngOnInit(): void {
    this.getProject();
  }

  getProject() {
    this.loaderService.startBackground();
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.columnsIds = project.statusColumns.map(s => s.id);
        this.board = project.board;
        this.loaderService.stopAll();
        if (this.taskId) {
          const task = this.project.tasks.find(t => t.id == this.taskId);
          this.openTaskDetails(task);
        }
      },
      error: (err) => {
        this.loaderService.stopAll();
        if (err.error.status == 401) {
          this.userNotAuthorized = true;
        }
      }
    })
  }

  addTaskToProject() {
    let task = {
      projectId: this.projectId, name: this.taskContent,
    }
    this.loaderService.startBackground();
    this.projectService.addTaskToProject(task).subscribe({
      next: () => {
        this.getProject();
      },
      error: (err) => {
        console.log('error', err);
      }
    });
  }

  openTaskForm() {
    this.openNewTaskForm = true;
    setTimeout(() => {
      this.newTaskInput.nativeElement.focus();
    }, 0);
  }

  onFocusOut() {
    if (this.taskContent == undefined && this.taskContent == null || this.taskContent?.trim().length == 0) {
      this.openNewTaskForm = false;
    } else {
      this.addTaskToProject();
      this.openNewTaskForm = false;
      this.taskContent = '';
    }
  }

  deleteTask(taskId: string) {
    const dialogRef = this.matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: {
        title: 'Suppression Tache',
        message: 'Etes-vous sûr de vouloir de supprimer cette tache ?',
        color: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      } else {
        this.projectService.deleteTask(this.projectId, taskId).subscribe({
          next: () => {
            this.getProject();
          },
          error: (err) => {
            console.log('error', err);
          }
        });
      }
    });
  }

  public dropGrid(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.board.columns,
      event.previousIndex,
      event.currentIndex
    );
  }

  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.loaderService.startBackground();
    let taskToChange = event.container.data[event.currentIndex] as any;
    let newStatus = this.project.statusColumns.find(s => s.id == event.container.id) as any;
    let previousRank = event.previousIndex;
    let nextRank = event.currentIndex;

    let task = {
      projectId: this.projectId,
      taskId: taskToChange.id,
      status: newStatus,
      previousRank: previousRank,
      newRank: nextRank
    };

    this.projectService.updateTaskStatus(task).subscribe(() => {
      this.loaderService.stopAll();
      taskToChange.status = newStatus;
    })
  }

  openTaskDetails(task: any) {
    this.updateRoute({ taskId: task.id });
    const dialogRef = this.matDialog.open(TaskDetailsComponent, {
      panelClass: 'task-details-dialog',
      data: { statusColumns: this.project.statusColumns, projectId: this.projectId, task: task },
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.taskChanged) {
        this.getProject();
        return;
      }
      this.updateRoute(null);
    });
  }

  updateRoute(params: any) {
    this.router.navigate([`./`],
      {
        queryParams: params,
        relativeTo: this.route
      });
  }

}

