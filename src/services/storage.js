// Storage and multi-user authentication service
import { AVATARS } from '../i18n/translations';

const USERS_KEY = 'kharcha_users_registry';
const SESSION_KEY = 'kharcha_active_session';

// Starter transactions for demo Kunal
const getStarterKunalData = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prevMonthDate = new Date(year, now.getMonth() - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = String(prevMonthDate.getMonth() + 1).padStart(2, '0');

  const goals = [
    { id: 'goal_1', name: 'Goa Trip with Friends 🏖️', target: 20000, ts: Date.now() - 30 * 86400000 },
    { id: 'goal_2', name: 'New iPhone / Gadget 📱', target: 65000, ts: Date.now() - 20 * 86400000 },
    { id: 'goal_3', name: 'Emergency Fund 🛡️', target: 50000, ts: Date.now() - 10 * 86400000 }
  ];

  const savings = [
    { id: 'sv_1', kind: 'deposit', amount: 8000, goal: 'goal_1', note: 'Monthly Goa savings', date: `${year}-${month}-05`, ts: Date.now() - 18 * 86400000 },
    { id: 'sv_2', kind: 'deposit', amount: 5000, goal: 'goal_1', note: 'Freelance bonus', date: `${year}-${month}-12`, ts: Date.now() - 12 * 86400000 },
    { id: 'sv_3', kind: 'deposit', amount: 15000, goal: 'goal_2', note: 'Festival gift money', date: `${year}-${month}-02`, ts: Date.now() - 22 * 86400000 },
    { id: 'sv_4', kind: 'deposit', amount: 10000, goal: 'goal_3', note: 'Initial safety buffer', date: `${prevYear}-${prevMonth}-28`, ts: Date.now() - 35 * 86400000 }
  ];

  const tx = [
    // Income
    { id: 'tx_1', type: 'income', amount: 65000, mode: 'Bank', category: 'Salary', note: 'Monthly Salary Credit', date: `${year}-${month}-01`, ts: Date.now() - 23 * 86400000 },
    { id: 'tx_2', type: 'income', amount: 12000, mode: 'UPI', category: 'Freelance', note: 'Website design gig', date: `${year}-${month}-10`, ts: Date.now() - 14 * 86400000 },
    // Expenses
    { id: 'tx_3', type: 'expense', amount: 15000, mode: 'Bank', category: 'Rent', note: 'Flat Rent', date: `${year}-${month}-02`, ts: Date.now() - 22 * 86400000 },
    { id: 'tx_4', type: 'expense', amount: 3200, mode: 'UPI', category: 'Bills', note: 'Electricity & Wifi bill', date: `${year}-${month}-04`, ts: Date.now() - 20 * 86400000 },
    { id: 'tx_5', type: 'expense', amount: 450, mode: 'UPI', category: 'Food', note: 'Chai & Samosa with team', date: `${year}-${month}-06`, ts: Date.now() - 18 * 86400000 },
    { id: 'tx_6', type: 'expense', amount: 2800, mode: 'Card', category: 'Shopping', note: 'New sneakers', date: `${year}-${month}-09`, ts: Date.now() - 15 * 86400000 },
    { id: 'tx_7', type: 'expense', amount: 350, mode: 'Cash', category: 'Travel', note: 'Auto fare to office', date: `${year}-${month}-11`, ts: Date.now() - 13 * 86400000 },
    { id: 'tx_8', type: 'expense', amount: 1850, mode: 'UPI', category: 'Food', note: 'Weekend dinner with Riya', date: `${year}-${month}-15`, ts: Date.now() - 9 * 86400000 },
    { id: 'tx_9', type: 'expense', amount: 800, mode: 'UPI', category: 'Fun', note: 'Movie tickets', date: `${year}-${month}-18`, ts: Date.now() - 6 * 86400000 },
    { id: 'tx_10', type: 'expense', amount: 1200, mode: 'Card', category: 'Health', note: 'Vitamins & medicines', date: `${year}-${month}-20`, ts: Date.now() - 4 * 86400000 },

    // Previous month sample
    { id: 'tx_prev_1', type: 'income', amount: 65000, mode: 'Bank', category: 'Salary', note: 'Previous Month Salary', date: `${prevYear}-${prevMonth}-01`, ts: Date.now() - 50 * 86400000 },
    { id: 'tx_prev_2', type: 'expense', amount: 15000, mode: 'Bank', category: 'Rent', note: 'Flat Rent', date: `${prevYear}-${prevMonth}-02`, ts: Date.now() - 49 * 86400000 },
    { id: 'tx_prev_3', type: 'expense', amount: 11500, mode: 'UPI', category: 'Shopping', note: 'Festival shopping', date: `${prevYear}-${prevMonth}-15`, ts: Date.now() - 40 * 86400000 }
  ];

  return {
    tx,
    savings,
    goals,
    themeHue: 175,
    darkMode: false,
    lang: 'en'
  };
};

// Initialize predefined users if first launch
export const initializeStorage = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: 'user_kunal',
        username: 'kunal',
        password: 'kunal123',
        name: 'Kunal Patle',
        avatar: AVATARS[1],
        createdAt: Date.now()
      },
      {
        id: 'user_riya',
        username: 'riya',
        password: 'riya123',
        name: 'Riya Sharma',
        avatar: AVATARS[0],
        createdAt: Date.now()
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));

    // Seed Kunal's data
    const kunalData = getStarterKunalData();
    localStorage.setItem(`kharcha_data_user_kunal`, JSON.stringify(kunalData));

    // Seed empty starter data for Riya
    const riyaData = {
      tx: [
        { id: 'tx_r1', type: 'income', amount: 45000, mode: 'Bank', category: 'Salary', note: 'Monthly Salary', date: new Date().toISOString().slice(0, 7) + '-01', ts: Date.now() },
        { id: 'tx_r2', type: 'expense', amount: 950, mode: 'UPI', category: 'Food', note: 'Cafe coffee', date: new Date().toISOString().slice(0, 10), ts: Date.now() }
      ],
      savings: [],
      goals: [{ id: 'goal_r1', name: 'Leh Ladakh Trip 🏔️', target: 35000, ts: Date.now() }],
      themeHue: 340,
      darkMode: false,
      lang: 'en'
    };
    localStorage.setItem(`kharcha_data_user_riya`, JSON.stringify(riyaData));
  }
};

// User authentication helpers
export const getUsers = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
};

export const findUser = (username, password) => {
  const users = getUsers();
  const cleanUsername = username.trim().toLowerCase();
  return users.find((u) => u.username.toLowerCase() === cleanUsername && u.password === password);
};

export const registerUser = ({ username, password, name, avatar }) => {
  const users = getUsers();
  const cleanUsername = username.trim().toLowerCase();

  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    throw new Error('USER_EXISTS');
  }

  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    username: cleanUsername,
    password: password,
    name: name.trim() || cleanUsername,
    avatar: avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
    createdAt: Date.now()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Initialize fresh empty book for new user
  const initialData = {
    tx: [],
    savings: [],
    goals: [],
    themeHue: 175,
    darkMode: false,
    lang: 'en'
  };
  localStorage.setItem(`kharcha_data_${newUser.id}`, JSON.stringify(initialData));

  return newUser;
};

// Session management
export const getActiveSession = () => {
  initializeStorage();
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
  } catch (e) {
    return null;
  }
};

export const setActiveSession = (user, remember = true) => {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  // If remember is true, store in localStorage (survives browser close).
  // Even if false, we save in sessionStorage or localStorage with a flag.
  // The user prompt specifically asked:
  // "remember the user once login and logged in always"
  const sessionData = {
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    remember: remember,
    loginTimestamp: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

export const clearActiveSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// User specific book data
export const getUserBookData = (userId) => {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(`kharcha_data_${userId}`);
    if (!raw) {
      const defaultState = {
        tx: [],
        savings: [],
        goals: [],
        themeHue: 175,
        darkMode: false,
        lang: 'en'
      };
      localStorage.setItem(`kharcha_data_${userId}`, JSON.stringify(defaultState));
      return defaultState;
    }
    return JSON.parse(raw);
  } catch (e) {
    return { tx: [], savings: [], goals: [], themeHue: 175, darkMode: false, lang: 'en' };
  }
};

export const saveUserBookData = (userId, data) => {
  if (!userId) return;
  try {
    localStorage.setItem(`kharcha_data_${userId}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage', e);
  }
};
