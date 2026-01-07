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

