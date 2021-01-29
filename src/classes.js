import { v4 as uuidv4 } from 'uuid';

class TodoProject {
    constructor(projectName, projectPriority) {
        this.projectName = projectName;
        this.projectPriority = projectPriority;
        this.id = uuidv4();
    }

    get name() {
        return this.projectName;
    }

    set name(value) {
        this.projectName = value;
    }

    get priority() {
        return this.projectPriority;
    }

    set priority(value) {
        this.projectPriority = value;
    }
}

class TodoItem {
    constructor(name, dueDate, dueTime, project, priority) {
        this.name = name;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.project = project;
        this.priority = priority;
        this.id = uuidv4();
    }
    get projectName() {
        return this.project.name
    }
    
    get projectPriority() {
        return this.project.priority
    }
}

export {TodoProject, TodoItem};