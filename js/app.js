let tasks = [];

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

function addTask(title) {
  if (title.trim() === '') return;
  
  const task = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    trollCounters: {
      runaway: 0,
      blur: 0,
      mirror: false,
      shyDelete: 0,
      fakeComplete: 0,
      clingy: false
    }
  };
  
  tasks.push(task);
  renderTasks();
  taskInput.value = '';
}

function renderTasks() {
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-card' + (task.completed ? ' completed' : '');
    li.setAttribute('data-id', task.id);
    
    li.innerHTML = `
      <div class="task-content">${task.title}</div>
      <div class="task-actions">
        <button class="btn-complete" data-id="${task.id}">Complete</button>
        <button class="btn-delete" data-id="${task.id}">Delete</button>
      </div>
    `;
    
    taskList.appendChild(li);
  });
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

