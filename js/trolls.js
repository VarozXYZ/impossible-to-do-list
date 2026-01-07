const TROLL_TYPES = ['runaway', 'blur', 'mirror', 'fakeComplete', 'clingy'];

let difficultyLevel = 'nightmare';
const DIFFICULTY_SETTINGS = {
  easy: {
    trollLimit: 1,
    blurIntensity: 3,
    name: 'Easy',
    clingyDuration: 1000
  },
  medium: {
    trollLimit: 2,
    blurIntensity: 5,
    name: 'Medium',
    clingyDuration: 1500
  },
  nightmare: {
    trollLimit: 3,
    blurIntensity: 8,
    name: 'Nightmare',
    clingyDuration: 2000
  }
};

function assignRandomTroll() {
  const randomIndex = Math.floor(Math.random() * TROLL_TYPES.length);
  return TROLL_TYPES[randomIndex];
}

function canActivateTroll(task) {
  if (!task || !task.trollType) return false;
  const limit = DIFFICULTY_SETTINGS[difficultyLevel].trollLimit;
  return task.trollCounter < limit;
}

function getTrollLimit() {
  return DIFFICULTY_SETTINGS[difficultyLevel].trollLimit;
}

function incrementTrollCounter(task) {
  if (!task) return;
  if (task.trollCounter === undefined) {
    task.trollCounter = 0;
  }
  task.trollCounter++;
}

function activateRunawayCard(cardElement, taskId, tasksArray, renderCallback) {
  if (!cardElement || !taskId || !tasksArray || !renderCallback) return;
  
  const task = tasksArray.find(t => t.id === taskId);
  if (!task) return;
  
  const currentIndex = tasksArray.indexOf(task);
  const taskList = document.getElementById('taskList');
  if (!taskList) return;
  
  const allWrappers = Array.from(taskList.querySelectorAll('.task-card-wrapper'));
  if (allWrappers.length <= 1) return;
  
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * allWrappers.length);
  } while (newIndex === currentIndex);
  
  const wrapper = cardElement.closest('.task-card-wrapper');
  if (wrapper) {
    wrapper.classList.add('runaway-moving');
  }
  
  tasksArray.splice(currentIndex, 1);
  tasksArray.splice(newIndex, 0, task);
  
  renderCallback();
  
  setTimeout(() => {
    const newWrapper = document.querySelector(`[data-id="${taskId}"]`)?.closest('.task-card-wrapper');
    if (newWrapper) {
      newWrapper.classList.remove('runaway-moving');
    }
  }, 500);
}

function activateBlurryVision(cardElement) {
  if (!cardElement) return;
  const contentElement = cardElement.querySelector('.task-title');
  if (contentElement) {
    const blurIntensity = DIFFICULTY_SETTINGS[difficultyLevel].blurIntensity;
    contentElement.style.filter = `blur(${blurIntensity}px)`;
    contentElement.classList.add('blurry-text');
  }
}

function clearBlur(cardElement) {
  if (!cardElement) return;
  const contentElement = cardElement.querySelector('.task-title');
  if (contentElement) {
    contentElement.style.filter = '';
    contentElement.classList.remove('blurry-text');
  }
}

function applyMirrorText(cardElement) {
  if (!cardElement) return;
  const contentElement = cardElement.querySelector('.task-title');
  if (contentElement) {
    contentElement.classList.add('mirror-text');
  }
}

function removeMirrorText(cardElement) {
  if (!cardElement) return;
  const contentElement = cardElement.querySelector('.task-title');
  if (contentElement) {
    contentElement.classList.remove('mirror-text');
  }
}

function fakeComplete(cardElement, taskId, tasksArray, renderCallback, saveCallback) {
  if (!cardElement || !taskId || !tasksArray || !renderCallback || !saveCallback) return;
  
  const task = tasksArray.find(t => t.id === taskId);
  if (!task) return;
  
  const taskIndex = tasksArray.indexOf(task);
  tasksArray.splice(taskIndex, 1);
  tasksArray.push(task);
  
  task.completed = true;
  renderCallback();
  saveCallback();
  
  setTimeout(() => {
    task.completed = false;
    renderCallback();
    saveCallback();
  }, 1500);
}

let clingyCardElement = null;
let clingyMouseMoveHandler = null;

function activateClingyCard(cardElement) {
  if (!cardElement) return;
  
  clingyCardElement = cardElement;
  cardElement.style.position = 'fixed';
  cardElement.style.zIndex = '1000';
  cardElement.classList.add('clingy');
  
  clingyMouseMoveHandler = (e) => {
    if (clingyCardElement) {
      clingyCardElement.style.left = (e.clientX - cardElement.offsetWidth / 2) + 'px';
      clingyCardElement.style.top = (e.clientY - cardElement.offsetHeight / 2) + 'px';
    }
  };
  
  document.addEventListener('mousemove', clingyMouseMoveHandler);
  
  const duration = DIFFICULTY_SETTINGS[difficultyLevel].clingyDuration;
  setTimeout(() => {
    deactivateClingyCard();
  }, duration);
}

function deactivateClingyCard() {
  if (clingyMouseMoveHandler) {
    document.removeEventListener('mousemove', clingyMouseMoveHandler);
    clingyMouseMoveHandler = null;
  }
  
  if (clingyCardElement) {
    clingyCardElement.classList.remove('clingy');
    clingyCardElement.style.position = '';
    clingyCardElement.style.left = '';
    clingyCardElement.style.top = '';
    clingyCardElement.style.zIndex = '';
    clingyCardElement = null;
  }
}

function showToast(title, message) {
  const toast = document.getElementById('toast');
  const toastTitle = toast.querySelector('.toast-title');
  const toastMessage = toast.querySelector('.toast-message');
  
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    hideToast();
  }, 2500);
}

function hideToast() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('hidden');
  }
}

window.hideToast = hideToast;

function changeDifficulty() {
  const levels = ['easy', 'medium', 'nightmare'];
  const currentIndex = levels.indexOf(difficultyLevel);
  const nextIndex = (currentIndex + 1) % levels.length;
  difficultyLevel = levels[nextIndex];
  
  const levelText = document.getElementById('levelText');
  if (levelText) {
    levelText.textContent = DIFFICULTY_SETTINGS[difficultyLevel].name;
  }
  
  showToast('Difficulty Changed!', `Now set to: ${DIFFICULTY_SETTINGS[difficultyLevel].name}`);
}

function showInfoPopup() {
  const popup = document.getElementById('infoPopup');
  if (popup) {
    popup.classList.remove('hidden');
  }
}

function hideInfoPopup() {
  const popup = document.getElementById('infoPopup');
  if (popup) {
    popup.classList.add('hidden');
  }
}

