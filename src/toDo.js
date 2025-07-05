import { addProjectToSide, addTaskToSide } from "./domChanges";
const projectSideBar = document.querySelector(".projects-container")

function generateId() {
    return crypto.randomUUID(); // modern browsers & Node.js
}

const mainProjectList = (function () {
    const projectsList = [];

    function addProjectToList(project) {
        projectsList.push(project);
    }

    function getProjects() {
        return [...projectsList]; // returns a copy, still keeps it private
    }

    function deleteProject(i) {
        projectsList.splice(i, 1);
    }

    function deleteTask(projectId, taskId) {
        for (const project of projectsList) {
            if (project.projectID === projectId) {
                for (let taskIndex = 0; taskIndex < (project.projectL).length; taskIndex++) {
                    if ((project.projectL[taskIndex]).taskID === taskId) {
                        project.projectL.splice(taskIndex, 1);
                        addTaskToSide(project);
                    }
                }
            }
        }

    }

    function addTaskToTheProject(projectId, taskTitle, desc, date, priority) {
        for (const project of projectsList) {
            if (project.projectID === projectId) {
                const taskId = project.addTaskToProject(taskTitle, desc, date, priority);
                return taskId;
            }
        }
    }

    function changeProjectName(projectId, newName) {
        for (let i = 0; i < projectsList.length; i++) {
            if (projectsList[i].projectID === projectId) {
                projectsList[i].projectTitle = newName;
                break;
            }
        }
    }

    return {
        addProjectToList,
        getProjects,
        deleteProject,
        changeProjectName,
        addTaskToTheProject,
        deleteTask,
    };
})();

class ToDoItem {
    constructor(taskTitle, desc, date, priority = "low") {
        this.taskID = `T${generateId()}`;
        this.taskTitle = taskTitle;
        this.desc = desc;
        this.date = date;
        this.priority = priority;
    }
}

class Project {
    projectL = [];
    constructor(projectTitle) {
        this.projectID = `P${generateId()}`;
        this.projectTitle = projectTitle;
        mainProjectList.addProjectToList(this);
        addProjectToSide(projectSideBar, this)
    }

    addTaskToProject(taskTitle, desc, date, priority = "low") {
        const newTask = new ToDoItem(taskTitle, desc, date, priority);
        this.projectL.push(newTask);
        addTaskToSide(this);
        return newTask.taskID;
    }

}

export { Project, mainProjectList };