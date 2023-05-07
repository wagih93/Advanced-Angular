import { Injectable } from '@angular/core';
import { HttpRepositoryService } from 'src/core/httpRepository.service';
import { Observable } from 'rxjs';
import { Project } from './models/project';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private BASE_URI = 'api/projects';

    constructor(private httpRepositoryService: HttpRepositoryService) { }

    getPaginatedProjects(page: number, pageSize: number, sortBy = '', sortDirection = 'desc', search = ''): Observable<any> {
        let params: any = {
            page: page,
            pageSize: pageSize
        };

        if (sortBy) {
            params['sortBy'] = sortBy;
        }

        if (sortDirection) {
            params['sortDirection'] = sortDirection;
        }

        if (search) {
            params['search'] = search;
        }

        return this.httpRepositoryService.get(this.BASE_URI, params);
    }

    getProjects() {
        return this.httpRepositoryService.get<Project[]>(`${this.BASE_URI}`);
    }

    getProject(projectId: string | null | undefined) {
        return this.httpRepositoryService.get<Project>(`${this.BASE_URI}/${projectId}`);
    }

    createProject(project?: Project) {
        return this.httpRepositoryService.post<any>(`${this.BASE_URI}`, project);
    }

    updateProject(project: Project) {
        return this.httpRepositoryService.put<Project>(`${this.BASE_URI}/${project.id}`, project);
    }

    deleteProject(projectId?: string) {
        return this.httpRepositoryService.delete<boolean>(`${this.BASE_URI}/${projectId}`);
    }

    addTeamMemberToProject(member: any) {
        return this.httpRepositoryService.post<any>(`${this.BASE_URI}/add-member`, member);
    }

    removeTeamMemberFromProject(member: any) {
        return this.httpRepositoryService.post<any>(`${this.BASE_URI}/remove-member`, member);
    }

    // Tasks management

    getTask(projectId: string, taskId?: string) {
        return this.httpRepositoryService.get<any>(`${this.BASE_URI}/${projectId}/${taskId}`);
    }

    addTaskToProject(task?: any) {
        return this.httpRepositoryService.post<any>(`${this.BASE_URI}/add-task`, task);
    }

    updateTask(task?: any) {
        return this.httpRepositoryService.post<any>(`${this.BASE_URI}/update-task`, task);
    }

    updateTaskStatus(task?: any) {
        return this.httpRepositoryService.post<any>(`${this.BASE_URI}/update-task-status`, task);
    }

    deleteTask(projectId: string, taskId?: string) {
        return this.httpRepositoryService.delete<boolean>(`${this.BASE_URI}/${projectId}/${taskId}`);
    }

}
