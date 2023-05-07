import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime, delay, distinctUntilChanged, filter, map, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { AccountService } from 'src/app/base-app/accounts/account.service';
import { User } from '../../accounts/models/user';
import { Project } from '../models/project';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-add-team-member-dialog',
  templateUrl: './add-team-member-dialog.component.html',
  styleUrls: ['./add-team-member-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTeamMemberDialogComponent implements OnInit {
  project!: Project;
  team: User[] = [];
  teamChanged = false;
  public userServerSideCtrl: FormControl<any> = new FormControl<any>(null);
  public userServerSideFilteringCtrl: FormControl<any> = new FormControl<string>('');
  public searching = false;
  public filteredServerSideUsers: any = new ReplaySubject<any[]>(1);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<AddTeamMemberDialogComponent>,
    public matDialog: MatDialog,
    private projectService: ProjectService,
    private loaderService: NgxUiLoaderService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.project = this.data.project;
    this.team = this.project.team;
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

  addMember() {
    const user = this.userServerSideCtrl.value;
    const userAlreadyExist = this.team.find(u => u.id == user.id) != null;
    if (userAlreadyExist) return;
    this.loaderService.startBackground();
    let member = {
      projectId: this.project.id,
      accountId: user.id
    }
    this.projectService.addTeamMemberToProject(member).subscribe({
      next: () => {
        this.team.push(user);
        this.teamChanged = true;
        this.loaderService.stopAll();
      },
      error: () => {
        this.loaderService.stopAll();
      }
    })
  }

  removeMember(member: User) {
    this.loaderService.startBackground();
    let memberToDelete = {
      projectId: this.project.id,
      accountId: member.id
    }
    this.projectService.removeTeamMemberFromProject(memberToDelete).subscribe({
      next: () => {
        this.teamChanged = true;
        const index = this.team.findIndex(u => u.id == member.id);
        this.team.splice(index, 1);
        this.loaderService.stopAll();
      },
      error: () => {
        this.loaderService.stopAll();
      }
    })
  }

}
