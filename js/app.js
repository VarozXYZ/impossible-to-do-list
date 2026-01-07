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
  
  tasks.forEach((task, index) => {
    const wrapper = document.createElement('li');
    wrapper.className = `task-card-wrapper ${task.completed ? 'completed-card' : ''}`;
    
    const card = document.createElement('div');
    card.className = `task-card shape-card shadow-sketch ${task.completed ? 'completed-bg' : ''}`;
    card.setAttribute('data-id', task.id);
    
    if (task.completed) {
      card.innerHTML = `
        <div class="check-btn completed-check">
          <span class="material-symbols-outlined">check</span>
        </div>
        <div class="task-content-wrapper">
          <p class="task-title font-hand completed-text">${task.title}</p>
          <svg class="strikethrough-svg" preserveAspectRatio="none" viewBox="0 0 100 10">
            <path d="M0,5 Q50,0 100,8" fill="none" stroke="var(--primary)" stroke-width="3"></path>
          </svg>
        </div>
        <button class="delete-btn disabled" data-id="${task.id}">
          <span class="material-symbols-outlined">delete</span>
        </button>
      `;
    } else {
      card.innerHTML = `
        <button class="check-btn" data-id="${task.id}">
          <span class="material-symbols-outlined">check</span>
        </button>
        <div class="task-content-wrapper">
          <p class="task-title font-hand">${task.title}</p>
        </div>
        <button class="delete-btn" data-id="${task.id}">
          <span class="material-symbols-outlined">delete_forever</span>
        </button>
      `;
    }
    
    wrapper.appendChild(card);
    taskList.appendChild(wrapper);
    
    if (task.trollType === 'mirror' && canActivateTroll(task)) {
      applyMirrorText(card);
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
      const contentElement = cardElement.querySelector('.task-title');
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
      const deleteButton = cardElement.querySelector('.delete-btn');
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
  const id = e.target.getAttribute('data-id') || e.target.closest('[data-id]')?.getAttribute('data-id');
  if (!id) return;
  
  if (e.target.classList.contains('check-btn') || e.target.closest('.check-btn')) {
    if (!e.target.closest('.check-btn')?.classList.contains('completed-check')) {
      completeTask(id);
    }
  } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
    if (!e.target.closest('.delete-btn')?.classList.contains('disabled')) {
      deleteTask(id);
    }
  }
});

const levelBtn = document.getElementById('levelBtn');
if (levelBtn) {
  levelBtn.addEventListener('click', changeDifficulty);
}

const infoBtn = document.getElementById('infoBtn');
if (infoBtn) {
  infoBtn.addEventListener('click', showInfoPopup);
}

const infoPopup = document.getElementById('infoPopup');
if (infoPopup) {
  infoPopup.addEventListener('click', (e) => {
    if (e.target === infoPopup) {
      hideInfoPopup();
    }
  });
}

tasks = loadTasks();
renderTasks();

