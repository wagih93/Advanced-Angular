import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from 'src/shared/services/notification.service';
import { Project } from '../models/project';
import { ProjectVisibilityEnum } from '../models/project-visibility';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddProjectDialogComponent implements OnInit {
  project: Project;
  mode: string = 'new';
  visibilities = [
    {
      name: 'Publique',
      value: ProjectVisibilityEnum.Public
    },
    {
      name: 'Privé',
      value: ProjectVisibilityEnum.Private
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<AddProjectDialogComponent>,
    private projectService: ProjectService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService) {
    this.project = new Project();
    if (this.data?.action === 'edit') {
      this.mode = this.data.action;
      this.project = { ...this.data.project };
    } else if (this.data?.action === 'new') {
      this.mode = this.data.action;
      this.project.visibility = this.visibilities[0].value;
    }
  }

  ngOnInit() {
  }

  manageProject() {
    if (this.mode == 'new') {
      this.createProject();
    } else {
      this.updateProject();
    }
  }

  createProject() {
    this.loaderService.start();
    this.projectService.createProject(this.project).subscribe({
      next: () => {
        this.loaderService.stop();
        this.notificationService.showSuccess('Projet creé avec succés');
        this.matDialogRef.close(true);
      },
      error: (err) => {
        this.loaderService.stop();
        this.notificationService.showStandarError();
        console.log('Error', err);
      }
    })
  }

  updateProject() {
    this.loaderService.start();
    this.projectService.updateProject(this.project).subscribe({
      next: () => {
        this.loaderService.stop();
        this.notificationService.showSuccess('Projet modifié avec succés');
        this.matDialogRef.close({ action: 'new' });
      },
      error: (err) => {
        this.loaderService.stop();
        this.notificationService.showStandarError();
        console.log('Error', err);
      }
    });
  }

}
