import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Project } from '../models/project';
import { ProjectService } from '../project.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { AddTeamMemberDialogComponent } from '../add-team-member-dialog/add-team-member-dialog.component';
import { ProjectsCommonUtils } from '../projects.common.utils';
import { AnimationsModule } from 'src/shared/modules/animation.module';
import { AccountService } from '../../accounts/account.service';
import { User } from '../../accounts/models/user';
import { UtilsService } from 'src/shared/services/utils.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  animations: AnimationsModule.inOutAnimation
})
export class ProjectDetailsComponent implements OnInit {
  project!: Project;
  projectId!: any;
  userNotAuthorized = false;
  connectedUser!: User | any;

  constructor(
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private projectService: ProjectService,
    private accountSerivice: AccountService,
    private loaderService: NgxUiLoaderService,
    public utilsService: UtilsService) {

    this.accountSerivice.connectedUser.subscribe((user) => {
      if (user) {
        this.connectedUser = user;
      }
    });
    this.projectId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProject();
  }

  getProject() {
    this.loaderService.startBackground();
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = { ...project, visibilityString: ProjectsCommonUtils.getProjectVisibility(project.visibility) };
        this.loaderService.stopAll();
      },
      error: (err) => {
        this.loaderService.stopAll();
        if (err.error.status == 401) {
          this.userNotAuthorized = true;
        }
      }
    })
  }

  openEditProjectDialog() {
    const dialogRef = this.matDialog.open(AddProjectDialogComponent, {
      panelClass: 'add-project-dialog',
      data: { action: 'edit', project: this.project },
      height: "95%",
      position: { right: '40px', top: '20px' }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getProject();
      }
    });
  }

  openAddMemberToProjectDialog() {
    const dialogRef = this.matDialog.open(AddTeamMemberDialogComponent, {
      panelClass: 'team-members-dialog',
      data: { project: this.project },
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getProject();
      }
    });
  }

}
