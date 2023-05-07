import { User } from "../../accounts/models/user";
import { Board } from "./board.model";
import { ProjectVisibilityEnum } from "./project-visibility";

export class Project {
    constructor() {
        this.team = [];
        this.tasks = [];
        this.statusColumns = [];
    }
    id!: string;
    name!: string;
    description!: string;
    visibility!: ProjectVisibilityEnum;
    visibilityString!:string;
    team: User[];
    tasks: ProjectTask[];
    statusColumns: StatusColumn[];

    board!: Board;
}

export class ProjectTask {
    id!: string;
    name!: string;
    description!: string;
    status!: StatusColumn;
    rank!: number;
    assignedTo!: User;
}

export class StatusColumn {
    id!: string;
    name!: string;
}
