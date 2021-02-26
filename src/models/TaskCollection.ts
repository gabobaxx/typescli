import {TaskItem} from './TaskItem';


type TaskCounts = {
    total: number,
    incomplete: number
}

export class TaskCollection {
     
    private nextId: number = 1;
    protected taskMap = new Map<number, TaskItem>();
    
    constructor(
        public username: string,
        public taskItem: TaskItem[] = []
    ){
        taskItem.forEach(item => this.taskMap.set(item.id, item));
    }

    // Methods
    addTask(task: string): number {
        while(this.getTaskById(this.nextId)){
            this.nextId++;
        }
        this.taskMap.set(this.nextId, new TaskItem(this.nextId, task));
        return this.nextId;
    }
    getTaskItem(includeComplete: boolean): TaskItem[]{
        return [...this.taskMap.values()].filter(task => includeComplete || !task.complete);
    }
    getTaskById(id: number): TaskItem | undefined {
        return this.taskMap.get(id);
    }
    markComplete(id: number, complete: boolean): void{
        const taskItem = this.getTaskById(id);
        if(taskItem){
            taskItem.complete = complete;
        }
    }
    removeComplete(): void{
        this.taskMap.forEach(item => {
            if(item.complete){
                this.taskMap.delete(item.id);
            }
        })
    }
    getTaskCount(): TaskCounts{
        return {
            total: this.taskMap.size,
            incomplete: this.getTaskItem(false).length
        }
    }
}
