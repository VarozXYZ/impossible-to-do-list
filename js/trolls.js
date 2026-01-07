const TROLL_TYPES = ['runaway', 'blur', 'mirror', 'shyDelete', 'fakeComplete', 'clingy'];
const DEFAULT_TROLL_LIMIT = 2;

function assignRandomTroll() {
  const randomIndex = Math.floor(Math.random() * TROLL_TYPES.length);
  return TROLL_TYPES[randomIndex];
}

function canActivateTroll(task) {
  if (!task || !task.trollType) return false;
  return task.trollCounter < DEFAULT_TROLL_LIMIT;
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
  const contentElement = cardElement.querySelector('.task-content');
  if (contentElement) {
    contentElement.classList.add('blurry-text');
  }
}

function clearBlur(cardElement) {
  if (!cardElement) return;
  const contentElement = cardElement.querySelector('.task-content');
  if (contentElement) {
    contentElement.classList.remove('blurry-text');
  }
}

function applyMirrorText(cardElement) {
  if (!cardElement) return;
  const contentElement = cardElement.querySelector('.task-content');
  if (contentElement) {
    contentElement.classList.add('mirror-text');
  }
}

function removeMirrorText(cardElement) {
  if (!cardElement) return;
  const contentElement = cardElement.querySelector('.task-content');
  if (contentElement) {
    contentElement.classList.remove('mirror-text');
  }
}

function activateShyDeleteButton(deleteButton) {
  if (!deleteButton) return;
  
  const cardElement = deleteButton.closest('.task-card');
  if (!cardElement) return;
  
  const randomOffsetX = (Math.random() - 0.5) * 100;
  const randomOffsetY = (Math.random() - 0.5) * 100;
  
  deleteButton.style.transform = `translate(${randomOffsetX}px, ${randomOffsetY}px) scale(0.5)`;
  deleteButton.style.transition = 'all 0.3s ease';
  deleteButton.style.pointerEvents = 'none';
  
  setTimeout(() => {
    deleteButton.style.transform = '';
    deleteButton.style.pointerEvents = '';
  }, 500);
}

