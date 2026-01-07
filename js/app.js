let tasks = [];

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

const TROLL_ICONS = {
  runaway: {
    path: 'assets/run-sports-runner-svgrepo-com.svg',
    description: 'Runaway Card: This task moves to a random position in the list when you hover over it.'
  },
  blur: {
    path: 'assets/blur-svgrepo-com.svg',
    description: 'Blurry Vision: This task text is blurry until you complete it.'
  },
  mirror: {
    path: 'assets/mirror-1-svgrepo-com.svg',
    description: 'Mirror Text: This task text is horizontally flipped until you complete it.'
  },
  fakeComplete: {
    path: 'assets/repeat-02-svgrepo-com.svg',
    description: 'Fake Complete: When you try to complete this task, it will appear completed but then uncomplete itself.'
  },
  clingy: {
    path: 'assets/sticky-boot-svgrepo-com.svg',
    description: 'Clingy Card: When you try to complete this task, it will follow your mouse cursor for a few seconds.'
  }
};

function getTrollIcon(task) {
  if (!task || !task.trollType || !TROLL_ICONS[task.trollType]) return null;
  return TROLL_ICONS[task.trollType];
}

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
    
    const trollIcon = getTrollIcon(task);
    const trollIconHtml = trollIcon ? `
      <div class="troll-icon-wrapper" data-troll-type="${task.trollType}">
        <img src="${trollIcon.path}" alt="Troll icon" class="troll-icon">
        <div class="troll-tooltip">${trollIcon.description}</div>
      </div>
    ` : '';
    
    if (task.completed) {
      card.innerHTML = `
        <button class="check-btn completed-check" data-id="${task.id}">
          <span class="material-symbols-outlined">check</span>
        </button>
        <div class="task-content-wrapper">
          <p class="task-title font-hand completed-text">${task.title}</p>
          <svg class="strikethrough-svg" preserveAspectRatio="none" viewBox="0 0 100 10">
            <path d="M0,5 Q50,0 100,8" fill="none" stroke="var(--primary)" stroke-width="3"></path>
          </svg>
        </div>
        <div class="task-actions">
          ${trollIconHtml}
          <button class="delete-btn" data-id="${task.id}">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <button class="check-btn" data-id="${task.id}">
          <span class="material-symbols-outlined">check</span>
        </button>
        <div class="task-content-wrapper">
          <p class="task-title font-hand">${task.title}</p>
        </div>
        <div class="task-actions">
          ${trollIconHtml}
          <button class="delete-btn" data-id="${task.id}">
            <span class="material-symbols-outlined">delete_forever</span>
          </button>
        </div>
      `;
    }
    
    wrapper.appendChild(card);
    taskList.appendChild(wrapper);
    
    if (task.trollType === 'mirror' && canActivateTroll(task) && !task.completed) {
      applyMirrorText(card);
      incrementTrollCounter(task);
      saveTasks(tasks);
    }
    
    if (task.trollType === 'blur' && !task.completed) {
      if (canActivateTroll(task)) {
        incrementTrollCounter(task);
        saveTasks(tasks);
      }
      activateBlurryVision(card);
    }
  });
  
  attachTrollBehaviors();
  attachTooltipHandlers();
}

function attachTooltipHandlers() {
  const trollIconWrappers = document.querySelectorAll('.troll-icon-wrapper');
  trollIconWrappers.forEach(wrapper => {
    const tooltip = wrapper.querySelector('.troll-tooltip');
    if (!tooltip) return;
    
    wrapper.addEventListener('mouseenter', () => {
      const rect = wrapper.getBoundingClientRect();
      tooltip.style.position = 'fixed';
      tooltip.style.bottom = 'auto';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
      tooltip.style.right = 'auto';
      tooltip.style.left = (rect.right - tooltip.offsetWidth) + 'px';
    });
    
    wrapper.addEventListener('mouseleave', () => {
      tooltip.style.position = '';
      tooltip.style.top = '';
      tooltip.style.left = '';
      tooltip.style.right = '';
      tooltip.style.bottom = '';
    });
  });
}

function attachTrollBehaviors() {
  tasks.forEach(task => {
    const cardElement = document.querySelector(`[data-id="${task.id}"]`);
    if (!cardElement || !task.trollType) return;
    
    if (task.trollType === 'runaway' && canActivateTroll(task)) {
      cardElement.addEventListener('mouseenter', () => {
        if (canActivateTroll(task)) {
          activateRunawayCard(cardElement, task.id, tasks, renderTasks);
          incrementTrollCounter(task);
          saveTasks(tasks);
        }
      });
    }
  });
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  if (task.trollType === 'clingy' && canActivateTroll(task) && !task.completed) {
    const cardElement = document.querySelector(`[data-id="${task.id}"]`);
    if (cardElement) {
      activateClingyCard(cardElement);
      incrementTrollCounter(task);
      saveTasks(tasks);
      return;
    }
  }
  
  if (task.trollType === 'fakeComplete' && canActivateTroll(task) && !task.completed) {
    const cardElement = document.querySelector(`[data-id="${task.id}"]`);
    if (cardElement) {
      fakeComplete(cardElement, task.id, tasks, renderTasks, saveTasks);
      incrementTrollCounter(task);
      saveTasks(tasks);
      return;
    }
  }
  
  const wasCompleted = task.completed;
  task.completed = !task.completed;
  
  if (task.completed && !wasCompleted) {
    const cardElement = document.querySelector(`[data-id="${task.id}"]`);
    if (cardElement) {
      clearBlur(cardElement);
      removeMirrorText(cardElement);
    }
    
    const taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1);
    tasks.push(task);
  } else if (!task.completed && wasCompleted) {
    const taskIndex = tasks.indexOf(task);
    tasks.splice(taskIndex, 1);
    tasks.unshift(task);
  }
  
  renderTasks();
  saveTasks(tasks);
}

function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  deactivateClingyCard();
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  saveTasks(tasks);
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
});

taskList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.delete-btn');
  const checkBtn = e.target.closest('.check-btn');
  
  if (deleteBtn && !deleteBtn.classList.contains('disabled')) {
    e.preventDefault();
    e.stopPropagation();
    const id = deleteBtn.getAttribute('data-id');
    if (id) {
      deleteTask(id);
    }
    return;
  }
  
  if (checkBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = checkBtn.getAttribute('data-id');
    if (id) {
      completeTask(id);
    }
    return;
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

