const TROLL_TYPES = ['runaway', 'blur', 'mirror', 'shyDelete', 'fakeComplete', 'clingy'];

let difficultyLevel = 'nightmare';
const DIFFICULTY_SETTINGS = {
  easy: {
    trollLimit: 1,
    blurIntensity: 3,
    name: 'Easy'
  },
  medium: {
    trollLimit: 2,
    blurIntensity: 5,
    name: 'Medium'
  },
  nightmare: {
    trollLimit: 3,
    blurIntensity: 8,
    name: 'Nightmare'
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

function activateRunawayCard(cardElement) {
  if (!cardElement) return;
  
  const maxX = window.innerWidth - cardElement.offsetWidth;
  const maxY = window.innerHeight - cardElement.offsetHeight;
  
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  
  cardElement.style.position = 'fixed';
  cardElement.style.left = randomX + 'px';
  cardElement.style.top = randomY + 'px';
  cardElement.style.zIndex = '1000';
  cardElement.style.transition = 'all 0.5s ease';
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

function activateShyDeleteButton(deleteButton) {
  if (!deleteButton) return;
  
  const randomOffsetX = (Math.random() - 0.5) * 100;
  const randomOffsetY = (Math.random() - 0.5) * 100;
  
  deleteButton.style.setProperty('--shy-x', randomOffsetX + 'px');
  deleteButton.style.setProperty('--shy-y', randomOffsetY + 'px');
  deleteButton.classList.add('shy');
  
  setTimeout(() => {
    deleteButton.classList.remove('shy');
    deleteButton.style.removeProperty('--shy-x');
    deleteButton.style.removeProperty('--shy-y');
  }, 500);
}

function fakeComplete(cardElement) {
  if (!cardElement) return;
  
  cardElement.classList.add('completed', 'fake-complete');
  
  setTimeout(() => {
    cardElement.classList.remove('completed', 'fake-complete');
  }, 1000);
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
  
  setTimeout(() => {
    deactivateClingyCard();
  }, 3000);
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

