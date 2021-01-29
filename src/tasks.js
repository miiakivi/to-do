import {
    TodoItem
} from "./classes";

import {
    displayNewTask,
} from "./dom";

import add from 'date-fns/add'

let editOldTaskForm = document.querySelector('.edit-old-task-form');
let taskContainer = document.querySelector('.tasks-container');


let tasks = [];

function getTasksThatAreDue(date) {
    if (date == 'today-due' || date == 'tomorrow-due') {
        displayTasksHeader(null, date);
    }

    let a = new Date();
    let today = dueTodayTasks(a);
    let tomorrow = dueTomorrowTasks(a);

    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if (element.dueDate == today && date == 'today-due') {
            displayNewTask(element);
        } else if (element.dueDate == tomorrow && date == 'tomorrow-due') {
            displayNewTask(element);
        }
    }
}



function dueTodayTasks(date) {
    let year = date.getFullYear();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }

    let today = `${year}-${month}-${day}`
    return today;
}

function dueTomorrowTasks(date) {
    const t = add(date, {
        days: 1
    })
    let year = t.getFullYear();
    let day = t.getDate();
    let month = t.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }

    let tomorrow = `${year}-${month}-${day}`
    return tomorrow;
}


function displayTasks() {
    displayTasksHeader(null, 'home');
    for (let i = 0; i < tasks.length; i++) {
        displayNewTask(tasks[i]);
    }
}

function displaySpecificTasks(filter) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].project == filter) {
            displayNewTask(tasks[i]);

        } else if (tasks[i].priority == filter) {
            displayNewTask(tasks[i]);
        }
    }
}

function displayTasksHeader(obj, submitType) {
    taskContainer.innerHTML = '';

    let header = document.querySelector('.task-cont-header');
    let html;

    switch (submitType) {
        case 'project':
            html = `<div class="color-code ${obj.projectPriority}"></div>
            <h1>${obj.projectName}</h1>`
            break;
        case 'priority':
            html = `<div class="color-code ${obj.name}"></div>
            <h1>${obj.name}</h1>`;
            break;
        case 'today-due':
            html = `<h1>Tasks that are due today</h1>`;
            break;
        case 'tomorrow-due':
            html = `<h1>Tasks that are due tomorrow</h1>`;
            break;
        case 'home':
            html = `<h1>Home</h1>`;
            break;
    }
    header.innerHTML = html;
}

//When user deletes project, all of the tasks in that project also are erased 
function eraseTasksFromProject(projectName) {
    for (let i = 0; i < tasks.length; i++) {        
        console.log('tasks project is ' + tasks[i].project + ' and removed projects name is ' + projectName);
        let tasksProject = tasks[i].project.toLowerCase();
        if (tasksProject == projectName) {
            let eleId = tasks[i].id;
            let element = document.getElementById(eleId);
            console.log(element);
            element.remove();
            tasks.splice(i, 1);
        } else {
            return
        }
    }
    saveTasksToStorage();
}

//When user wants to edit already existing task. Open obj values in the form.
function openFormWithObjValues(event) {
    let element = event.target;
    let parentId = element.parentNode.id;
    let formElements = editOldTaskForm.elements;

    let taskId;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.id == parentId) {
            taskId = task.id;
            for (let j = 0; j < formElements.length; j++) {
                let eleName = formElements[j].name;
                switch (eleName) {
                    case 'task-name':
                        formElements[j].value = task.name;
                        break;
                    case 'project':
                        formElements[j].value = task.project;
                        break;
                    case 'dueDate':
                        formElements[j].value = task.dueDate;
                        break;
                    case 'time':
                        formElements[j].value = task.dueTime;
                        break;
                    case 'task-priority':
                        if (formElements[j].id == task.priority) {
                            formElements[j].checked = true;
                        }
                        break;
                }
            }
        }
    }
    return taskId;
}

function getValuesFromTaskForm(data, id, submitType) {
    let taskName;
    let projectName;
    let dueDate;
    let dueTime;
    let taskPriority;

    for (const entry of data) {
        console.log(entry[0] + ' = ' + entry[1]);
        switch (entry[0]) {
            case 'task-name':
                taskName = entry[1];
                break;
            case 'select-project':                
                projectName = entry[1];
                break;
            case 'dueDate':
                dueDate = entry[1];
                break;
            case 'time':
                dueTime = entry[1];
                break;
            case 'task-priority':
                taskPriority = entry[1];
                break;
        }
    }
    if (submitType == 'edit') {
        return changeOldTaskObjValues(id, taskName, projectName, dueDate, dueTime, taskPriority);
    } else if (submitType == 'addNew') {
        return new TodoItem(taskName, dueDate, dueTime, projectName, taskPriority);
    }
}

//When user is ready to submit edited values to the task, this changes the right task obj
function changeOldTaskObjValues(id, name, project, duedate, duetime, priority) {
    let obj;
    for (let i = 0; i < tasks.length; i++) {
        let element = tasks[i];
        //By comparing elements id to the obj.id we find the right obj
        if (element.id == id) {
            obj = tasks[i];
            element.name = name;
            element.project = project;
            element.dueDate = duedate;
            element.dueTime = duetime;
            element.priority = priority;
        }
    }
    return obj;
}

function editOldTask(form, id) {
    let data = new FormData(form);
    let obj = getValuesFromTaskForm(data, id, 'edit');

    displayNewTaskAfterEdit(id, obj);
    saveTasksToStorage();
}

//Changes the screen view, that edited task values show
function displayNewTaskAfterEdit(id, obj) {
    let element = document.getElementById(id)
    let childElements = element.children;

    for (let i = 0; i < childElements.length; i++) {
        const e = childElements[i];
        //elements class name list
        const eClassNames = e.classList;

        for (let j = 0; j < eClassNames.length; j++) {
            switch (eClassNames[j]) {
                case 'task-name':
                    e.innerHTML = obj.name;
                    break;
                case 'due-date':
                    e.innerHTML = obj.dueDate;
                    break;
                case 'due-time':
                    e.innerHTML = obj.dueTime;
                    break;
                case 'color-code':
                    //Because class name priority is always on the last item on the divs classlist
                    let elementsPriority = eClassNames[2];
                    e.classList.remove(elementsPriority);
                    e.classList.add(obj.priority);
                    break;
            }
        }
    }
}



function makeNewTask(form) {
    let data = new FormData(form);
    let newTask = getValuesFromTaskForm(data, null, 'addNew');
    displayNewTask(newTask);
    tasks.push(newTask);
    saveTasksToStorage();
    console.log('There are ' + tasks.length + ' tasks in the tasks array');
}

function removeTaskFromView(event) {
    let element = event.target;

    let parentId = element.parentNode.id;
    document.getElementById(parentId).style.opacity = 0;
    setTimeout(function () {
        document.getElementById(parentId).remove();
        console.log('task is now removed from view');
    }, 900);
}

function removeTaskObjWhenComplete(event) {
    let element = event.target;
    let parentId = element.parentNode.id;
    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id == parentId) {
                tasks.splice(i, 1);
                saveTasksToStorage();
                console.log('Removed task named ' + tasks[i].name + '. tasks length is now ' + tasks.length);
            }
        }
    }
}






function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//pulls tasks from local storage when page is refreshed
function readTasksFromStorage() {
    // gets information from local storage to use in displayBooks to create display
    let tasksJson = localStorage.getItem('tasks');
    if (tasksJson != null && tasksJson.length > 0) {
        //parses a JSON string to 'normal' value, number to integar yms.
        tasks = JSON.parse(tasksJson);
    } else {
        //If storage is empty, generoi these tasks on the page
        generateDefaultTasks()
    }
}

function generateDefaultTasks() {
    let clean = new TodoItem('Clean apartment #home', '2021-01-30', '21.00', 'home', 'priority5');
    let workProject = new TodoItem('Do work project #work', '2021-02-06', '15.00', 'work', 'priority2');
    let movie = new TodoItem('Star Wars Revenge of the Sith #movies', '2021-06-13', '20.00', 'movies to watch', 'priority3');
    let sport = new TodoItem('Go outside #home', '2021-01-31', '18.00', 'home', 'priority1');

    tasks.push(clean, workProject, movie, sport);
}



export {
    readTasksFromStorage,
    displayTasks,
    makeNewTask,
    removeTaskFromView,
    removeTaskObjWhenComplete,
    openFormWithObjValues,
    editOldTask,
    eraseTasksFromProject,
    displaySpecificTasks,
    getTasksThatAreDue,
    displayTasksHeader,
}