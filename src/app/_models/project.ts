import { Task } from "./task";

export class Project {
    projectId: number;
    name: string;
    description: string;
    tasks: Task[];
}