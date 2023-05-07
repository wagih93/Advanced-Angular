import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AnimationsModule } from 'src/shared/modules/animation.module';
import { NotificationService } from 'src/shared/services/notification.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { AccountService } from '../../accounts/account.service';
import { User } from '../../accounts/models/user';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { Project } from '../models/project';
import { ProjectService } from '../project.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  animations: AnimationsModule.inOutAnimation
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  connectedUser!: User | any;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private accountSerivice: AccountService,
    public utilsService: UtilsService,
    public _matDialog: MatDialog,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService) {

    this.accountSerivice.connectedUser.subscribe((user) => {
      if (user) {
        this.connectedUser = user;
      }
    });
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.loaderService.startBackground();
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loaderService.stopAll();
      },
      error: () => {
        this.notificationService.showStandarError();
        this.loaderService.stopAll();
      }
    })
  }

  createProject() {
    const dialogRef = this._matDialog.open(AddProjectDialogComponent, {
      panelClass: 'add-project-dialog',
      data: { action: 'new', project: null },
      height: "95%",
      position: { right: '40px', top: '20px' }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getProjects();
      }
    });
  }

  getProjectDetails(proejctId: string) {
    this.router.navigateByUrl(`projects/details/${proejctId}`);
  }

}
