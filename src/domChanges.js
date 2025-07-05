import { Project, mainProjectList } from "./toDo";

export function initializeUIHandlers() {
    const addProject = document.querySelector(".add-project");
    const addProjectDialog = document.querySelector("#new-project-dialog");
    const addProjectButton = document.querySelector(".add-project-button")

    const currentProjectNameDialog = document.querySelector("#project-name-dialog");
    const changeCurrentProjectNameButton = document.querySelector(".change-name-button");

    const currentProjectButtonContainer = document.querySelector(".current-project-name-container");
    const deleteProject = document.querySelector(".delete-project-button");
    const changeProjectNameButton = document.querySelector(".change-name-button");
    const projectsContainer = document.querySelector(".projects-container");
    const taskList = document.querySelector(".todo-list");

    const addTaskButton = document.querySelector(".add-task-btn");
    const addTaskToListButton = document.querySelector(".add-task-button-dialog");
    const addTaskDialog = document.querySelector("#new-task-dialog");

    const dialogCloseButtons = document.querySelectorAll(".close-dialog");
    dialogCloseButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const dialog = button.closest("dialog");
            if (dialog) dialog.close();
        });

    });

    function deleteProjectFromSide(projectID) {
        const projectToDelete = projectsContainer.querySelector(`[data-project-id="${projectID}"]`)
        projectToDelete.remove();
    }

    taskList.addEventListener("click", function (e) {
        const taskDoneBtn = e.target;
        if (taskDoneBtn.classList.contains("task-done")) {
            const taskContainer = taskDoneBtn.closest(".todo-item");

            const currentProjectOnHeader = document.querySelector(".current-project-name");
            const currentProjectId = currentProjectOnHeader.getAttribute("data-project-id");

            const taskId = taskDoneBtn.getAttribute("data-task-id");

            mainProjectList.deleteTask(currentProjectId, taskId);


            if (taskContainer) {
                taskContainer.remove();
            }

        }
    })

    changeProjectNameButton.addEventListener("click", function () {
        const newProjectName = (document.querySelector("#new-project-name")).value;
        (document.querySelector("#new-project-name")).value = "";

        const currentProjectOnHeader = document.querySelector(".current-project-name");
        const currentProjectId = currentProjectOnHeader.getAttribute("data-project-id");
        const selectedProjectOnSideBar = projectsContainer.querySelector(`[data-project-id="${currentProjectId}"]`)
        const projectH3 = selectedProjectOnSideBar.querySelector("h3");
        mainProjectList.changeProjectName(currentProjectId, newProjectName);
        projectH3.textContent = newProjectName;
        currentProjectOnHeader.textContent = newProjectName;
        currentProjectNameDialog.close();
    })

    addTaskToListButton.addEventListener("click", function () {
        const currentprojectName = document.querySelector(".current-project-name");
        if (!currentprojectName) return;
        const currentProjectId = currentprojectName.getAttribute("data-project-id");

        const taskName = (document.querySelector("#new-task-name")).value;
        (document.querySelector("#new-task-name")).value = "";
        const taskDesc = (document.querySelector("#new-task-desc")).value;
        (document.querySelector("#new-task-desc")).value = "";
        const taskDate = (document.querySelector("#new-task-date")).value;
        (document.querySelector("#new-task-date")).value = "";
        const taskPriority = (document.querySelector("#new-task-priority")).value;
        (document.querySelector("#new-task-priority")).value = "low";

        const newTaskId = mainProjectList.addTaskToTheProject(currentProjectId, taskName, taskDesc, taskDate, taskPriority);
        createTaskDomFromFields(taskList, newTaskId, taskName, taskDesc, taskDate, taskPriority);
        addTaskDialog.close();
    })

    addProject.addEventListener("click", function () {
        addProjectDialog.showModal();
    });

    addProjectButton.addEventListener("click", function () {
        const newProjectName = (document.querySelector("#new-project")).value;
        (document.querySelector("#new-project")).value = "";
        const newProject = new Project(newProjectName);
        addProjectDialog.close();
    })

    currentProjectButtonContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("current-project-name")) {
            currentProjectNameDialog.showModal();
        }
    });

    deleteProject.addEventListener("click", function () {
        const cuProjectbtn = currentProjectButtonContainer.querySelector(".current-project-name")
        if (!cuProjectbtn) return;
        const currentProjectId = cuProjectbtn.getAttribute("data-project-id");
        const projectsList = mainProjectList.getProjects();
        for (let i = 0; i < projectsList.length; i++) {
            if (projectsList[i].projectID === currentProjectId) {
                currentProjectButtonContainer.innerHTML = "";
                taskList.innerHTML = "";
                mainProjectList.deleteProject(i);
                deleteProjectFromSide(currentProjectId);
                currentProjectNameDialog.close();
                return;
            }
        }

    })

    projectsContainer.addEventListener("click", function (e) {
        const chosenProject = e.target.closest(".project-container");
        if (!chosenProject) return;

        currentProjectButtonContainer.innerHTML = "";
        taskList.innerHTML = "";

        const chosenProjectDataAtt = chosenProject.getAttribute("data-project-id");

        let chosenProjectClass = null;
        for (const project of mainProjectList.getProjects()) {
            if (project.projectID === chosenProjectDataAtt) {
                chosenProjectClass = project;
                break;
            }
        }
        if (!chosenProjectClass) return;

        const button = document.createElement("button");
        button.classList.add("current-project-name");
        button.textContent = chosenProjectClass.projectTitle;
        button.setAttribute("data-project-id", chosenProjectDataAtt);
        currentProjectButtonContainer.appendChild(button);

        for (const task of chosenProjectClass.projectL) {
            createTaskDom(taskList, task);
        }

    });


    changeCurrentProjectNameButton.addEventListener("click",
        function () {
            const newCurrentProjectName = (document.querySelector("#new-project-name")).value;
            document.querySelector("#new-project-name").value = "";
        }
    )

    addTaskButton.addEventListener("click", function () {
        const currentprojectName = document.querySelector(".current-project-name");
        if (!currentprojectName) {
            alert("No project selected");
            return;
        }
        addTaskDialog.showModal();
    });


}

export function addProjectToSide(container, project) {
    // const projectContainer = document.createElement("div");
    // projectContainer.classList.add("project-container")
    // projectContainer.setAttribute("data-project-id", project.projectID);
    // const projectName = document.createElement("h3");
    // projectName.textContent = project.projectTitle;
    // projectContainer.appendChild(projectName);
    // const projectsList = document.createElement("ul");
    // projectsList.classList.add("todo-list-demo")
    // projectContainer.appendChild(projectsList);
    // container.appendChild(projectContainer);

    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");
    projectContainer.setAttribute("data-project-id", project.projectID);

    // Project title
    const projectName = document.createElement("h3");
    projectName.textContent = project.projectTitle;

    // Create the UL up front
    const projectsList = document.createElement("ul");
    projectsList.classList.add("todo-list-demo");

    // Append everything in one go
    projectContainer.append(projectName, projectsList);
    container.appendChild(projectContainer);
}

export function addTaskToSide(project) {
    // const maxTasksToShow = 3;
    // const projectDiv = document.querySelector(`[data-project-id="${project.projectID}"]`);

    // if (projectDiv) {
    //     const ulContainer = projectDiv.querySelector("ul");

    //     ulContainer.innerHTML = "";

    //     const tasksToShow = project.projectL.slice(0, maxTasksToShow);
    //     tasksToShow.forEach(task => {
    //         const li = document.createElement("li");
    //         li.classList.add("todo-title-demo");
    //         li.textContent = task.taskTitle;
    //         ulContainer.appendChild(li);
    //     });
    // }

    const projectsContainer = document.querySelector(".projects-container");
    if (!projectsContainer) return;

    const projectDiv = projectsContainer.querySelector(
        `[data-project-id="${project.projectID}"]`
    );
    if (!projectDiv) return;

    // Look for an existing <ul>…
    let ulContainer = projectDiv.querySelector("ul");

    // If it’s missing for any reason, put a fresh one in
    if (!ulContainer) {
        ulContainer = document.createElement("ul");
        ulContainer.classList.add("todo-list-demo");
        projectDiv.appendChild(ulContainer);
    }

    // Now it’s safe to clear & re‑populate
    ulContainer.innerHTML = "";

    project.projectL.slice(0, 3).forEach((task) => {
        const li = document.createElement("li");
        li.classList.add("todo-title-demo");
        li.textContent = task.taskTitle;
        ulContainer.appendChild(li);
    });
}

function createTaskDom(container, task) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("todo-item");
    taskContainer.setAttribute("data-task-id", task.taskID);

    const taskButton = document.createElement("button");
    taskButton.classList.add("task-done");
    taskButton.setAttribute("data-task-id", task.taskID);
    taskButton.textContent = "✓";

    const taskTitle = document.createElement("p");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.taskTitle;

    const taskDesc = document.createElement("p");
    taskDesc.classList.add("task-desc");
    taskDesc.textContent = task.desc;

    const taskDate = document.createElement("p");
    taskDate.classList.add("task-date");
    taskDate.textContent = task.date;

    const taskPriority = document.createElement("div");
    switch ((task.priority).toLowerCase()) {
        case "low":
            taskPriority.classList.add("priority", "low");
            break;
        case "normal":
            taskPriority.classList.add("priority", "normal")
            break;
        case "high":
            taskPriority.classList.add("priority", "high")
            break;
    }

    taskContainer.append(taskButton, taskTitle, taskDesc, taskDate, taskPriority);
    container.appendChild(taskContainer);
}

function createTaskDomFromFields(container, taskId, taskTitle, taskDesc, taskDate, taskPriority) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("todo-item");
    taskContainer.setAttribute("data-task-id", taskId)

    const taskButton = document.createElement("button");
    taskButton.classList.add("task-done");
    taskButton.setAttribute("data-task-id", taskId)

    taskButton.textContent = "✓";

    const title = document.createElement("p");
    title.classList.add("task-title");
    title.textContent = taskTitle;

    const desc = document.createElement("p");
    desc.classList.add("task-desc");
    desc.textContent = taskDesc;

    const date = document.createElement("p");
    date.classList.add("task-date");
    date.textContent = taskDate;

    const priority = document.createElement("div");
    switch (taskPriority.toLowerCase()) {
        case "low":
            priority.classList.add("priority", "low");
            break;
        case "normal":
            priority.classList.add("priority", "normal");
            break;
        case "high":
            priority.classList.add("priority", "high");
            break;
    }

    taskContainer.append(taskButton, title, desc, date, priority);
    container.appendChild(taskContainer);
}
