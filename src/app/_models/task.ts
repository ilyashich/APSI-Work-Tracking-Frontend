import { Job } from "./job";

export class Task {
    taskId: number;
    name: string;
    description: string;
    jobs: Job[];
}