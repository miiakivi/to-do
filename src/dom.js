let headAndFoot = document.querySelectorAll(".main");
let taskContainer = document.querySelector('.tasks-container');
let openProjectForm = document.querySelector('.add-project-btn');
let projectForm = document.querySelector('.add-project-form');



let projectsFolderIsOpen = false;
let filterFolderIsOpen = false;
let projectFormOpen = false;

let formIsOpen = false;

function toggleTaskFormDisplay() {
    let form = document.querySelector('.task-form');
    if (!formIsOpen) {
        form.style.display = 'block';
        formIsOpen = true;
        console.log('Form is open? ' + formIsOpen);
    } else if (formIsOpen) {
        form.style.display = 'none';
        formIsOpen = false;
        console.log('Form is open? ' + formIsOpen);
    }

}

function openNav() {
    document.getElementById("side-nav").style.width = "300px";
    headAndFoot.forEach(section => section.style.marginLeft = "0");
    document.querySelector('.content').style.marginLeft = "100px";
    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 1);
    document.querySelector('#side-btn').style.opacity = 1;

}

function closeNav() {
    document.getElementById("side-nav").style.width = "100px";
    headAndFoot.forEach(section => section.style.marginLeft = "-200px");
    document.querySelector('.content').style.marginLeft = "-100px";

    document.querySelectorAll('.menu-item').forEach(item => item.style.opacity = 0);
    document.querySelector('#side-btn').style.opacity = 0;
}

function toggleFolderDisplay(e) {
    let targetId = e.target.id;
    if (targetId == 'projects') {
        document.querySelector(".project-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-folder").classList.toggle('filter-margin-top');

    } else if (targetId == 'filter') {
        document.querySelector(".filter-menu").classList.toggle("menu-visible");
        document.querySelector(".filter-span").classList.toggle("rotate-span")
    }
    rotateProjectSpanArrow(targetId);
    console.log('You clicked ' + targetId);
}

function rotateProjectSpanArrow(id) {
    if (id == 'projects') {
        let targetElement = document.querySelector(".project-span");
        if (!projectsFolderIsOpen) {
            targetElement.style.transform = 'rotate(360deg)';
            projectsFolderIsOpen = true;
        } else {
            targetElement.style.transform = 'rotate(270deg)';
            projectsFolderIsOpen = false;
        }
    } else if (id == 'filter') {
        let targetElement = document.querySelector(".filter-span");
        if (!filterFolderIsOpen) {
            targetElement.style.transform = 'rotate(360deg)';
            filterFolderIsOpen = true;
        } else {
            targetElement.style.transform = 'rotate(270deg)';
            filterFolderIsOpen = false;
        }
    }
}

function displayNewTask(obj) {
    let taskHtml = document.createElement('div');
    taskHtml.classList.add('task', 'fade-effect');
    taskHtml.id = obj.id;
    taskHtml.innerHTML = `<input class="div1 task-completed" type="radio">` +
        `<div class="div2 color-code ${obj.priority}"></div>` +
        `<div class = "div9 task-name" >${obj.name}</div>` +
        `<div class="div4"><img src="pics/calendar2.png"></div>` +
        `<div class="div5 due-date">${obj.dueDate}</div>` +
        `<div class="div6"><img src="pics/alarm-clock.png"> </div>` +
        `<div class = "div7 due-time" >${obj.dueTime}</div>` +
        `<button class="div8 edit-task-btn">edit</button>` +
        `<div class="div3"> </div>`;
    taskContainer.appendChild(taskHtml);
}

function displayNewProject(obj) {
    let projectFolder = document.querySelector('.project-menu');

    let projectItem = document.createElement('div');
    projectItem.classList.add('project-item');
    projectItem.id = obj.id;
    projectItem.innerHTML = `<div class="${obj.projectPriority} color-code"></div>` +
        `<p>${obj.projectName}</p></div>`;
    projectFolder.appendChild(projectItem);
}



function toggleProjectFormDisplay() {
    if (!projectFormOpen) {
        displayProjectForm();
        projectFormOpen = true;
    } else {
        removeProjectForm();
        projectFormOpen = false;
    }
}

function displayProjectForm() {
    projectForm.innerHTML = `<span class="close-form-btn">&#10006;</span><h2>Add project</h2><hr class="divider"/>` +
        `<label for="project-name" class="text-label">Project name</label> <br />` +
        `<input class="input-field" maxlength="20" required type="text" id="project-name" name="project-name"/>` +
        `<div class="select-priority-cont"><div class="priority-cont"> <input type="radio" name="task-priority" id=priority1"" value="priority1"/>` +
        `<div class="priority1 color-code"></div><label for="priority1"> Priority 1</label> </div>` +
        `<div class="priority-cont"><input type="radio" name="task-priority" id="priority2" value="priority2"/>` +
        `<div class="priority2 color-code"></div><label for="priority2"> Priority 2</label></div>` +
        `<div class="priority-cont"><input type="radio" name="task-priority" id="priority3" value="priority3"/><div class="priority3 color-code"></div>` +
        `<label for="priority3"> Priority 3</label></div><div class="priority-cont"><input type="radio" name="task-priority" id="priority4" value="priority4"/>` +
        `<div class="priority4 color-code"></div><label for="priority4"> Priority 4</label></div><div class="priority-cont">` +
        `<input type="radio" name="task-priority" id="priority5" value="priority5"/><div class="priority5 color-code"></div>` +
        `<label for="priority5"> Priority 5</label></div></div>` +
        `<input type="submit" value="Add" class="add-project"/><input type="reset" value="Cancel"/>`;
}

function removeProjectForm() {
    projectForm.innerHTML = '';
}

openProjectForm.addEventListener('click', function () {
    toggleProjectFormDisplay();
})


export {
    openNav,
    closeNav,
    toggleFolderDisplay,
    toggleTaskFormDisplay,
    displayNewTask,
    displayNewProject,
};