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

function fakeComplete(cardElement) {
  if (!cardElement) return;
  
  cardElement.classList.add('completed');
  cardElement.style.transition = 'all 0.3s ease';
  
  setTimeout(() => {
    cardElement.classList.remove('completed');
  }, 1000);
}

let clingyCardElement = null;
let clingyMouseMoveHandler = null;

function activateClingyCard(cardElement) {
  if (!cardElement) return;
  
  clingyCardElement = cardElement;
  cardElement.style.position = 'fixed';
  cardElement.style.zIndex = '1000';
  cardElement.style.transition = 'none';
  
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
    clingyCardElement.style.position = '';
    clingyCardElement.style.left = '';
    clingyCardElement.style.top = '';
    clingyCardElement.style.zIndex = '';
    clingyCardElement.style.transition = '';
    clingyCardElement = null;
  }
}

function triggerConfetti() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ECC71', '#E74C3C', '#9B59B6'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    
    const angle = (Math.random() - 0.5) * 60;
    const velocity = 2 + Math.random() * 3;
    const rotation = Math.random() * 360;
    
    confetti.style.transform = `rotate(${rotation}deg)`;
    confetti.style.transition = 'all 3s ease-out';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.style.left = (parseFloat(confetti.style.left) + Math.sin(angle * Math.PI / 180) * 200) + 'px';
      confetti.style.top = window.innerHeight + 10 + 'px';
      confetti.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

