let tasks = [];
let editIndex = null; 

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');


function handleTask() {
    const taskValue = taskInput.value.trim();
    
    if (taskValue === "") {
        alert("Please enter a task!");
        return;
    }

    if (editIndex !== null) {
        
        tasks[editIndex] = taskValue;
        editIndex = null;
        addBtn.innerText = "Add Task";
        addBtn.style.background = "#28a745";
    } else {
        
        tasks.push(taskValue);
    }

    taskInput.value = ""; 
    renderTasks();
}


function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = "task-item";
        li.innerHTML = `
            <span>${task}</span>
            <div>
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}


window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
};


window.editTask = function(index) {
    taskInput.value = tasks[index];
    editIndex = index;
    addBtn.innerText = "Update";
    addBtn.style.background = "#ffc107";
    taskInput.focus();
};


addBtn.addEventListener('click', handleTask);


taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleTask();
});