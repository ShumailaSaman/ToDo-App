document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = storedTasks;
  updateTaskList();
  updateStats();
});

let tasks = [];
let editIndex = null; // To track which task is being edited

// Function to save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();

  if (text) {
    if (editIndex !== null) {
      // Update existing task
      tasks[editIndex].text = text;
      editIndex = null;
      document.getElementById("newTask").textContent = "+"; // Reset button text
    } else {
      // Add new task
      tasks.push({ text: text, completed: false });
    }

    taskInput.value = ""; // Clear input field
    saveTasks(); // Save to localStorage
    updateTaskList();
  }
};

const updateTaskList = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
      <div class="taskItem">
        <div class="task ${task.completed ? "completed" : ""}">
          <input type="checkbox" class="checkbox" ${
            task.completed ? "checked" : ""
          }>
          <p>${task.text}</p>
        </div>
        <div class="icons">
          <img src="./img/edit.png" alt="Edit" onClick="editTask(${index})">
          <img src="./img/bin.png" alt="Delete" onClick="deleteTask(${index})">
        </div>
      </div>
    `;

    listItem
      .querySelector(".checkbox")
      .addEventListener("change", () => toggleTaskComplete(index));

    taskList.appendChild(listItem);
  });

  saveTasks();
  updateStats();
};

// Edit Task - Puts the task into the input field for updating
const editTask = (index) => {
  const taskInput = document.getElementById("taskInput");
  taskInput.value = tasks[index].text;
  editIndex = index; // Store index for updating
  // document.getElementById("newTask").textContent = "Update"; // Change button text
};

// Delete Task
const deleteTask = (index) => {
  tasks.splice(index, 1);
  saveTasks();
  updateTaskList();
};

// Toggle Task Completion
const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  updateTaskList();
};

// Update Stats and Progress Bar
const updateStats = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  document.getElementById(
    "numbers"
  ).textContent = `${completedTasks} / ${totalTasks}`;
  document.getElementById("progress").style.width =
    totalTasks === 0 ? "0%" : `${(completedTasks / totalTasks) * 100}%`;

  if (tasks.length && completedTasks == totalTasks) {
    blaskConfetti();
  }
};

// Event listener for adding/updating tasks
document.getElementById("newTask").addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});

const blaskConfetti = () => {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
