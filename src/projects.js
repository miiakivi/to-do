import {
    TodoProject
} from "./classes";

import {
    displayNewProject,
} from "./dom";

import {
    eraseTasksFromProject,
    displaySpecificTasks,
    displayTasksHeader,
    
} from "./tasks";



let openProjectForm = document.querySelector('.add-project-btn');
let projectForm = document.querySelector('.add-project-form');

let projectsFolder = document.querySelector('.project-menu');
let priorityFolderItems = document.querySelectorAll('.filter-name');

let projectFormOpen = false;

let projects = [];
let priorityArr = ['priority1', 'priority2', 'priority3', 'priority4', 'priority5']

let projectId;

//Return right obj, that is later used to generate task header
function getProjectObjForHeader(id) {
    console.log('id is ' + id);
    for (let i = 0; i < projects.length; i++) {
        let nameToLower = projects[i].projectName.toLowerCase();
        nameToLower = nameToLower.replace(/\s+/g, '');
        if (id == nameToLower) {
            return projects[i];
        }
    }
    for(let i=0; i < priorityArr.length; i++) {
        if (id == priorityArr[i]) {
            let priorityObj = {name: id};
            return priorityObj
        } 
    }
        
    
}

//depending on what button user clicks, project is edited or deleted
function submitEditedProject(e) {
    if (e.target.className == 'edit-project') {
        editOldProject(projectForm, projectId);
        projectForm.reset();
    } else if (e.target.className == 'delete-project') {
        eraseProject(e);
    }
}

//When project settings icon is clicked, open project form
function getProjectForm(e) {
    displayProjectForm('Edit project');
    projectId = openFormWithObjValues(e);
    projectForm.style.opacity = 1;
}

//When user clicks specific project, open right tasks in screen
function displayProjectFolderTasks(elementId) {
    let projectObj = getProjectObjForHeader(elementId);
    displayTasksHeader(projectObj, 'project');
    displaySpecificTasks(elementId);

}

// opens project form or project tasks to view depending what user clicks
function listenProjectFolder(e) {
    let elementClasses = e.target.classList;
    let elementId = e.target.id;
    for (let i = 0; i < elementClasses.length; i++) {
        if (elementClasses[i] == 'settings-icon') {
            getProjectForm(e);
        }
        if (elementClasses[i] == 'project-name') {
            displayProjectFolderTasks(elementId);
        }
    }
}

function eventListeners() {



    //Edits already existing projects
    projectForm.addEventListener('click', function (e) {
        submitEditedProject(e);
    }, false)

    //Listens project folder
    projectsFolder.addEventListener('click', function (e) {
        listenProjectFolder(e)
    })

    priorityFolderItems.forEach(item => {
        item.addEventListener('click', function (e) {
            let elementId = e.target.id;
            console.log(elementId);
            let projectObj = getProjectObjForHeader(elementId);
            displayTasksHeader(projectObj, 'priority');
            displaySpecificTasks(elementId);
        })
    })

    openProjectForm.addEventListener('click', function () {
        toggleProjectFormDisplay();
    })
}

function displayProjectsInTaskForm(type) {
    let selectCont = document.querySelector('.select-project');
    let div = document.createElement('div');
    let select = document.createElement('select');
    select.id = "select-project";
    select.name = "select-project";

    for (let i = 0; i < projects.length; i++) {
        let projectName = projects[i].projectName;
        select.innerHTML += `<option value= ${projectName}>${projectName}`;
    }

    if (type == 'add new') {
        selectCont.appendChild(select);
    } else if (type == 'edit') {
        div.appendChild(select);
        return div
    }
}




function eraseProject(e) {
    let confirmation = confirm("You are about to delete a project and all of the tasks in that project.\nAre you sure?")
    if (confirmation) {
        let objName = getProjectName(projectId);
        eraseTasksFromProject(objName);
        deleteProjectObj(projectId);
        removeProjectFromView(projectId);
        removeProjectForm();
    }
    saveProjectsToStorage();
    e.preventDefault();
}

function getProjectName(id) {
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id == id) {
            let projectName = projects[i].projectName;
            return projectName.toLowerCase();
        }
    }
}

function deleteProjectObj(id) {
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id == id) {
            console.log('project ' + projects[i].projectName + ' is being removed');
            projects.splice(i, 1);
            saveProjectsToStorage();
        }
    }
}

function removeProjectFromView(id) {
    let element = document.getElementById(id);
    element.style.opacity = 0;
    element.style.marginBottom = '-40px';
    setTimeout(function () {
        element.remove();
        console.log('project is now removed from view');
    }, 900);
}

function editOldProject(form, id) {
    let data = new FormData(form);
    let obj = getNewProject(data, id, 'edit');
    displayEditedProject(obj, id);
    saveProjectsToStorage();
}

function displayEditedProject(obj, id) {
    let element = document.getElementById(id);
    let childElements = element.children;


    for (let i = 0; i < childElements.length; i++) {
        const e = childElements[i];
        //elements class name list
        const eClassNames = e.classList;

        for (let j = 0; j < eClassNames.length; j++) {
            switch (eClassNames[j]) {
                case 'project-name':
                    e.innerHTML = obj.projectName;
                    break;
                case 'color-code':
                    //Because class name priority is always on the last item on the divs classlist
                    let elementsPriority = eClassNames[1];
                    e.classList.remove(elementsPriority);
                    e.classList.add(obj.projectPriority);
                    break;
            }
        }
    }
}

function getNewProject(data, id, submitType) {
    let projectName;
    let projectPriority;

    for (const entry of data) {
        console.log(entry[0] + ' = ' + entry[1]);
        if (entry[0] == 'task-priority') {
            projectPriority = entry[1];
        } else if (entry[0] == 'project-name') {
            projectName = entry[1];
        }
    }
    if (submitType == 'edit') {
        return changeOldProjectObjValues(id, projectName, projectPriority)
    } else if (submitType == 'addNew') {
        return new TodoProject(projectName, projectPriority);
    }

}

function changeOldProjectObjValues(id, name, priority) {
    let obj;
    for (let i = 0; i < projects.length; i++) {
        let element = projects[i];
        //By comparing elements id to the obj.id we find the right obj
        if (element.id == id) {
            obj = projects[i];
            console.log('obj name before editing is ' + obj.projectName);
            element.projectName = name;
            element.projectPriority = priority;
        }
    }
    console.log('obj name after editing is ' + obj.projectName);
    return obj;
}

//When user wants to edit already existing project. Open obj values in the form.
function openFormWithObjValues(event) {
    let element = event.target;
    let parentId = element.parentNode.id;
    let formElements = projectForm.elements;
    let projectId;

    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];
        if (project.id == parentId) {
            projectId = project.id;

            for (let j = 0; j < formElements.length; j++) {
                let eleName = formElements[j].name;
                switch (eleName) {
                    case 'project-name':
                        formElements[j].value = project.projectName;
                        break;
                    case 'task-priority':
                        if (formElements[j].id == project.projectPriority) {
                            console.log(formElements[j].id);
                            formElements[j].checked = true;
                        }
                        break;
                }
            }
        }
    }
    return projectId;
}

function makeNewProject(form) {
    let data = new FormData(form);
    let newProject = getNewProject(data, null, 'addNew');
    projects.push(newProject);
    displayNewProject(newProject);
    saveProjectsToStorage();
}

function displayProjects() {
    console.log('There is ' + projects.length + ' projects in the array');
    for (let i = 0; i < projects.length; i++) {
        displayNewProject(projects[i]);
    }
}

function generateDefaultProjects() {
    let general = new TodoProject('General', 'priority2');
    let home = new TodoProject('Home', 'priority3');
    let work = new TodoProject('Work', 'priority1');
    let movies = new TodoProject('Movies to watch', 'priority5')
    projects.push(general, home, work, movies);
}


function saveProjectsToStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function readProjectsFromStorage() {
    let projectsJson = localStorage.getItem('projects');

    if (projectsJson != null && projectsJson.length > 0) {
        projects = JSON.parse(projectsJson);
    } else {
        generateDefaultProjects();
    }
}


function toggleProjectFormDisplay() {
    if (!projectFormOpen) {
        projectForm.style.opacity = 1;
        displayProjectForm('Add project');
        projectFormOpen = true;
    } else {
        removeProjectForm();
        projectFormOpen = false;
    }
}

function displayProjectForm(task) {
    projectForm.innerHTML = `<span class="close-form-btn">&#10006;</span>
    <h2>${task}</h2><hr class="divider"/>` +
        `<label for="project-name" class="text-label">Project name</label> 
        <br />` +
        `<input class="input-field" maxlength="20" required type="text" id="project-name" name="project-name"/>` +
        `<div class="select-priority-cont">
        <div class="priority-cont"> 
            <input type="radio" name="task-priority" id="priority1" value="priority1"/>` +
        `   <div class="color-code priority1"></div>
            <label for="priority1"> Priority 1</label> 
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority2" value="priority2"/>` +
        `   <div class="color-code priority2"></div>
            <label for="priority2"> Priority 2</label>
        </div>` +
        `<div class="priority-cont">
            <input type="radio" name="task-priority" id="priority3" value="priority3"/>
            <div class="color-code priority3"></div>` +
        `   <label for="priority3"> Priority 3</label>
        </div>
        <div class="priority-cont">
            <input type="radio" name="task-priority" id="priority4" value="priority4"/>` +
        `   <div class="color-code priority4"></div>
            <label for="priority4"> Priority 4</label>
        </div>
        <div class="priority-cont">` +
        `   <input type="radio" name="task-priority" id="priority5" value="priority5"/>
            <div class="color-code priority5"></div>` +
        `   <label for="priority5"> Priority 5</label>
        </div>
        </div>`;

    if (task == 'Edit project') {
        projectForm.innerHTML += `<input type="submit" value="Edit" class="edit-project"/>
        <button class="delete-project" >Delete project</button>`;
    } else if (task == 'Add project') {
        projectForm.innerHTML += `<input type="submit" value="Add" class="add-project"/>
        <input type="reset" value="Cancel"/>`;
    }
}

function removeProjectForm() {
    projectForm.style.opacity = 0;
    setTimeout(function () {
        projectForm.innerHTML = '';
    }, 1000);

}

eventListeners();

export {
    makeNewProject,
    readProjectsFromStorage,
    displayProjects,
    displayProjectsInTaskForm,
}