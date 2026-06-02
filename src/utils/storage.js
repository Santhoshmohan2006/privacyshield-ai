// Expanded LocalStorage and Gamification utility

export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  // Initialize gamification on new user
  if (!localStorage.getItem('xp')) localStorage.setItem('xp', '0');
  if (!localStorage.getItem('streak')) localStorage.setItem('streak', '1');
  if (!localStorage.getItem('lastLogin')) localStorage.setItem('lastLogin', new Date().toDateString());
  if (!localStorage.getItem('badges')) localStorage.setItem('badges', JSON.stringify([]));
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([
      {
        id: '1',
        title: 'Welcome to PrivacyShield!',
        description: 'Start exploring quizzes and interactive scenarios to level up your privacy skills.',
        time: new Date().toISOString(),
        read: false
      }
    ]));
  }
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

// --- XP and LEVELING SYSTEM ---
export const getXP = () => {
  return parseInt(localStorage.getItem('xp') || '0', 10);
};

export const addXP = (amount) => {
  const currentXP = getXP();
  const newXP = currentXP + amount;
  localStorage.setItem('xp', newXP.toString());
  
  // Add notifications on level transitions
  const oldLevel = getLevelInfo(currentXP).levelName;
  const newLevel = getLevelInfo(newXP).levelName;
  if (oldLevel !== newLevel) {
    addNotification('Level Up! 🎉', `You have reached level ${newLevel}! Keep protecting user privacy.`);
  }
  return newXP;
};

export const getLevelInfo = (xp = getXP()) => {
  if (xp < 300) {
    return { levelName: 'Novice', currentLevel: 1, nextLevelXP: 300, prevLevelXP: 0 };
  } else if (xp < 800) {
    return { levelName: 'Expert', currentLevel: 2, nextLevelXP: 800, prevLevelXP: 300 };
  } else if (xp < 1800) {
    return { levelName: 'Master', currentLevel: 3, nextLevelXP: 1800, prevLevelXP: 800 };
  } else {
    return { levelName: 'Guardian', currentLevel: 4, nextLevelXP: 5000, prevLevelXP: 1800 };
  }
};

// --- STREAK TRACKING ---
export const getStreak = () => {
  updateStreak();
  return parseInt(localStorage.getItem('streak') || '1', 10);
};

export const updateStreak = () => {
  const lastLoginStr = localStorage.getItem('lastLogin');
  const todayStr = new Date().toDateString();
  
  if (!lastLoginStr) {
    localStorage.setItem('lastLogin', todayStr);
    localStorage.setItem('streak', '1');
    return;
  }
  
  if (lastLoginStr === todayStr) {
    return; // Already logged in today, streak is current
  }
  
  const lastLogin = new Date(lastLoginStr);
  const today = new Date(todayStr);
  const diffTime = Math.abs(today - lastLogin);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    // Logged in the next day, increment streak
    const currentStreak = parseInt(localStorage.getItem('streak') || '1', 10);
    const newStreak = currentStreak + 1;
    localStorage.setItem('streak', newStreak.toString());
    localStorage.setItem('lastLogin', todayStr);
    addNotification('Daily Streak! 🔥', `You have maintained a ${newStreak}-day learning streak!`);
    addXP(20); // Bonus XP for streak
  } else if (diffDays > 1) {
    // Streak broken, reset
    localStorage.setItem('streak', '1');
    localStorage.setItem('lastLogin', todayStr);
  }
};

// --- QUIZ SCORES & BADGES ---
export const saveScore = (quizId, score, maxScore) => {
  const scores = JSON.parse(localStorage.getItem('scores') || '[]');
  scores.push({ quizId, score, maxScore, date: new Date().toISOString() });
  localStorage.setItem('scores', JSON.stringify(scores));
  
  // XP Rewards
  const baseXP = score * 20; // 20 XP per correct answer
  const bonusXP = score === maxScore ? 50 : 0; // Perfect score bonus
  addXP(baseXP + bonusXP);
  
  // Log Activity
  logActivity('Quiz Completed', `Scored ${score}/${maxScore} on Quiz ${quizId}`);
  
  // Award Badges
  const earnedNewBadges = [];
  const currentBadges = getBadges();
  
  // First Step Badge
  if (!currentBadges.includes('First Step')) {
    earnedNewBadges.push('First Step');
    addNotification('New Badge Unlocked! 🛡️', 'You unlocked the "First Step" badge for completing your first quiz.');
    addXP(100);
  }
  
  // Perfect Score Badge
  if (score === maxScore && !currentBadges.includes('Perfect Score')) {
    earnedNewBadges.push('Perfect Score');
    addNotification('New Badge Unlocked! 🌟', 'You unlocked the "Perfect Score" badge for answering all questions correctly.');
    addXP(100);
  }

  // Speed Demon (assuming quiz is fast? We will award if completed with a high score)
  if (score >= maxScore - 1 && !currentBadges.includes('Speed Demon')) {
    earnedNewBadges.push('Speed Demon');
    addNotification('New Badge Unlocked! ⚡', 'You unlocked the "Speed Demon" badge for an impressive quiz performance.');
    addXP(100);
  }

  // Privacy Expert Badge (if all quizzes completed)
  const uniqueQuizzesTaken = new Set(scores.map(s => s.quizId)).size;
  if (uniqueQuizzesTaken >= 6 && !currentBadges.includes('Privacy Expert')) {
    earnedNewBadges.push('Privacy Expert');
    addNotification('New Badge Unlocked! 🏆', 'Congratulations! You unlocked the "Privacy Expert" badge for completing all topics.');
    addXP(250);
  }

  if (earnedNewBadges.length > 0) {
    const updated = [...currentBadges, ...earnedNewBadges];
    localStorage.setItem('badges', JSON.stringify(updated));
  }
};

export const getScores = () => {
  return JSON.parse(localStorage.getItem('scores') || '[]');
};

export const getBadges = () => {
  return JSON.parse(localStorage.getItem('badges') || '[]');
};

// --- CHOOSE YOUR OWN ADVENTURE / SCENARIOS ---
export const saveScenarioCompletion = (scenarioId, pathName, score) => {
  const completions = JSON.parse(localStorage.getItem('scenarioCompletions') || '[]');
  completions.push({ scenarioId, pathName, score, date: new Date().toISOString() });
  localStorage.setItem('scenarioCompletions', JSON.stringify(completions));
  
  // XP reward
  addXP(80);
  
  // Log Activity
  logActivity('Scenario Solved', `Completed interactive scenario "${scenarioId}" via path "${pathName}"`);

  // Award Scenario Master Badge
  const currentBadges = getBadges();
  if (!currentBadges.includes('Scenario Master')) {
    const updated = [...currentBadges, 'Scenario Master'];
    localStorage.setItem('badges', JSON.stringify(updated));
    addNotification('New Badge Unlocked! 🧭', 'You unlocked the "Scenario Master" badge for completing a privacy simulation.');
    addXP(150);
  }
};

export const getScenarioCompletions = () => {
  return JSON.parse(localStorage.getItem('scenarioCompletions') || '[]');
};

// --- NOTIFICATIONS STORE ---
export const getNotifications = () => {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
};

export const addNotification = (title, description) => {
  const notifications = getNotifications();
  notifications.unshift({
    id: Date.now().toString(),
    title,
    description,
    time: new Date().toISOString(),
    read: false
  });
  // Keep only last 15 notifications
  if (notifications.length > 15) {
    notifications.pop();
  }
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Trigger a custom event to alert active listeners
  window.dispatchEvent(new Event('notifications_updated'));
};

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  localStorage.setItem('notifications', JSON.stringify(updated));
  window.dispatchEvent(new Event('notifications_updated'));
};

// --- ACTIVITY LOGS ---
export const logActivity = (action, details) => {
  const logs = JSON.parse(localStorage.getItem('activities') || '[]');
  logs.unshift({
    id: Date.now().toString(),
    action,
    details,
    timestamp: new Date().toISOString()
  });
  // Keep last 30 logs
  if (logs.length > 30) logs.pop();
  localStorage.setItem('activities', JSON.stringify(logs));
  window.dispatchEvent(new Event('activities_updated'));
};

export const getActivities = () => {
  return JSON.parse(localStorage.getItem('activities') || '[]');
};

// --- CHAT HISTORY ---
export const getChatHistory = () => {
  return JSON.parse(localStorage.getItem('chatHistory') || '[]');
};

export const saveChatHistory = (history) => {
  localStorage.setItem('chatHistory', JSON.stringify(history));
};

// --- API CONFIGS ---
export const saveApiSettings = (key) => {
  localStorage.setItem('geminiApiKey', key);
};

export const getApiSettings = () => {
  return localStorage.getItem('geminiApiKey');
};
