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

