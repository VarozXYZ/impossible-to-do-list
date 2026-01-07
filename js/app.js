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
    trollType: assignRandomTroll(),
    trollCounter: 0
  };
  
  tasks.push(task);
  renderTasks();
  saveTasks(tasks);
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
    
    if (task.trollType === 'mirror' && canActivateTroll(task)) {
      applyMirrorText(li);
      incrementTrollCounter(task);
      saveTasks(tasks);
    }
  });
  
  attachTrollBehaviors();
}

function attachTrollBehaviors() {
  tasks.forEach(task => {
    const cardElement = document.querySelector(`[data-id="${task.id}"]`);
    if (!cardElement || !task.trollType) return;
    
    if (task.trollType === 'runaway' && canActivateTroll(task)) {
      cardElement.addEventListener('mouseenter', () => {
        if (canActivateTroll(task)) {
          activateRunawayCard(cardElement);
          incrementTrollCounter(task);
          saveTasks(tasks);
        }
      });
    }
    
    if (task.trollType === 'blur' && canActivateTroll(task)) {
      const contentElement = cardElement.querySelector('.task-content');
      if (contentElement) {
        contentElement.addEventListener('mouseenter', () => {
          if (canActivateTroll(task)) {
            activateBlurryVision(cardElement);
            incrementTrollCounter(task);
            saveTasks(tasks);
          }
        });
      }
      
      cardElement.addEventListener('click', () => {
        clearBlur(cardElement);
      });
    }
    
    if (task.trollType === 'mirror') {
      cardElement.addEventListener('dblclick', () => {
        removeMirrorText(cardElement);
      });
    }
    
    if (task.trollType === 'shyDelete' && canActivateTroll(task)) {
      const deleteButton = cardElement.querySelector('.btn-delete');
      if (deleteButton) {
        deleteButton.addEventListener('mouseenter', () => {
          if (canActivateTroll(task)) {
            activateShyDeleteButton(deleteButton);
            incrementTrollCounter(task);
            saveTasks(tasks);
          }
        });
      }
    }
  });
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  if (task.trollType === 'fakeComplete' && canActivateTroll(task) && !task.completed) {
    const cardElement = document.querySelector(`[data-id="${task.id}"]`);
    if (cardElement) {
      fakeComplete(cardElement);
      incrementTrollCounter(task);
      saveTasks(tasks);
      return;
    }
  }
  
  const wasCompleted = task.completed;
  task.completed = !task.completed;
  renderTasks();
  saveTasks(tasks);
  
  if (!wasCompleted && task.completed) {
    triggerConfetti();
  }
}

function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  if (task.trollType === 'clingy' && canActivateTroll(task)) {
    const cardElement = document.querySelector(`[data-id="${task.id}"]`);
    if (cardElement) {
      activateClingyCard(cardElement);
      incrementTrollCounter(task);
      saveTasks(tasks);
      return;
    }
  }
  
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  saveTasks(tasks);
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
});

taskList.addEventListener('click', (e) => {
  const id = e.target.getAttribute('data-id');
  if (!id) return;
  
  if (e.target.classList.contains('btn-complete')) {
    completeTask(id);
  } else if (e.target.classList.contains('btn-delete')) {
    deleteTask(id);
  }
});

tasks = loadTasks();
renderTasks();

