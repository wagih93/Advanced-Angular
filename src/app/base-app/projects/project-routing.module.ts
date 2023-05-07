import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuGuard } from 'src/guards/menu.guard';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { TaskBoardComponent } from './tasks/task-board/task-board.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'list',
        component: ProjectsListComponent,
        canActivate: [MenuGuard]
    },
    {
        path: 'details/:id',
        component: ProjectDetailsComponent,
        canActivate: [MenuGuard]
    },
    {
        path: 'board/:id',
        component: TaskBoardComponent,
        canActivate: [MenuGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }
