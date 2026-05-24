import { useState, useEffect } from 'react';

export type Goal = {
  id: string;
  name: string;
  category: 'school' | 'finance' | 'health' | 'personal';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  history: { date: string; value: number }[];
};

export type Subject = {
  id: string;
  name: string;
  progress: number;
  nextAssessment: string;
  notes: string;
};

export type Assignment = {
  id: string;
  subject: string;
  name: string;
  dueDate: string;
  status: 'todo' | 'done';
};

export type Habit = {
  id: string;
  name: string;
  streak: number;
  bestStreak: number;
  history: Record<string, boolean>;
};

export type SleepEntry = {
  date: string;
  label: string;
  hours: number;
};

export type DrinkLog = {
  id: string;
  name: string;
  amount: number;
  time: string;
};

export type HydrationDay = {
  date: string;
  goal: number;
  logs: DrinkLog[];
};

export type JournalEntry = {
  id: string;
  date: string;
  events: string;
  growth: string;
  plan: string;
  emotions: string[];
  mood: number;
  images: string[];
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
};

export type TimetableCell = {
  subject: string;
  room: string;
};

export type Timetable = {
  [day: string]: {
    [period: string]: TimetableCell;
  };
};

export type DashboardData = {
  focus: string;
  quoteDate: string;
  goals: Goal[];
  subjects: Subject[];
  assignments: Assignment[];
  habits: Habit[];
  sleep: SleepEntry[];
  hydration: HydrationDay[];
  hydrationGoal: number;
  journal: JournalEntry[];
  timetable: Timetable;
  finance: {
    balance: number;
    goal: number;
    goalName: string;
    transactions: Transaction[];
  };
};

function dateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
}

function computeStreak(history: Record<string, boolean>): { streak: number; bestStreak: number } {
  const today = new Date();
  let streak = 0;
  const cur = new Date(today);
  while (true) {
    const key = cur.toISOString().split('T')[0];
    if (history[key]) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }

  const trueDates = Object.keys(history)
    .filter(k => history[k])
    .sort();

  let best = streak;
  let run = 0;
  let prev: Date | null = null;
  for (const ds of trueDates) {
    const d = new Date(ds);
    if (prev) {
      const diff = Math.round((d.getTime() - prev.getTime()) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = d;
  }

  return { streak, bestStreak: best };
}

function generateHabitHistory(): Record<string, boolean> {
  const h: Record<string, boolean> = {};
  for (let i = 0; i < 35; i++) {
    h[dateStr(i)] = Math.random() > 0.35;
  }
  h[dateStr(0)] = false;
  return h;
}

function makeSeed(): DashboardData {
  const habitHistories = [
    generateHabitHistory(),
    generateHabitHistory(),
    generateHabitHistory(),
    generateHabitHistory(),
    generateHabitHistory(),
  ];

  const habits: Habit[] = [
    { id: '1', name: 'Drink 2L Water', ...computeStreak(habitHistories[0]), history: habitHistories[0] },
    { id: '2', name: 'Exercise 30min', ...computeStreak(habitHistories[1]), history: habitHistories[1] },
    { id: '3', name: 'Read 20min', ...computeStreak(habitHistories[2]), history: habitHistories[2] },
    { id: '4', name: 'No phone before bed', ...computeStreak(habitHistories[3]), history: habitHistories[3] },
    { id: '5', name: 'Review notes', ...computeStreak(habitHistories[4]), history: habitHistories[4] },
  ];

  const goalBase = dateStr(0);
  function buildHistory(start: number, end: number, steps: number) {
    return Array.from({ length: steps }, (_, i) => ({
      date: dateStr(steps - i - 1),
      value: +(start + ((end - start) * i) / (steps - 1)).toFixed(1),
    }));
  }

  return {
    focus: 'Finish Science Lab Report',
    quoteDate: '',
    goals: [
      { id: '1', name: 'Get Band 6 in Maths', category: 'school', target: 100, current: 65, unit: '%', deadline: '2026-11-01', history: buildHistory(40, 65, 6) },
      { id: '2', name: 'Save for Headphones', category: 'finance', target: 300, current: 120, unit: '$', deadline: '2026-08-15', history: buildHistory(20, 120, 6) },
      { id: '3', name: 'Run 5km', category: 'health', target: 5, current: 3.2, unit: 'km', deadline: '2026-06-01', history: buildHistory(1, 3.2, 6) },
    ],
    subjects: [
      { id: '1', name: 'English', progress: 40, nextAssessment: '2026-06-10', notes: 'Read chapters 1-4' },
      { id: '2', name: 'Mathematics', progress: 60, nextAssessment: '2026-06-15', notes: 'Practice past papers' },
      { id: '3', name: 'Science', progress: 35, nextAssessment: '2026-06-05', notes: 'Lab report due' },
      { id: '4', name: 'Geography', progress: 50, nextAssessment: '2026-06-20', notes: '' },
      { id: '5', name: 'History', progress: 20, nextAssessment: '2026-07-01', notes: '' },
      { id: '6', name: 'Information Technology', progress: 80, nextAssessment: '2026-05-30', notes: 'Project milestone' },
    ],
    assignments: [
      { id: '1', subject: 'English', name: 'English Essay', dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], status: 'todo' },
      { id: '2', subject: 'Science', name: 'Lab Report', dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], status: 'todo' },
    ],
    habits,
    sleep: [
      { date: dateStr(6), label: 'Mon', hours: 7.5 },
      { date: dateStr(5), label: 'Tue', hours: 6.8 },
      { date: dateStr(4), label: 'Wed', hours: 8.1 },
      { date: dateStr(3), label: 'Thu', hours: 7.2 },
      { date: dateStr(2), label: 'Fri', hours: 6.5 },
      { date: dateStr(1), label: 'Sat', hours: 9.0 },
      { date: dateStr(0), label: 'Sun', hours: 8.5 },
    ],
    hydration: [
      {
        date: dateStr(0),
        goal: 2000,
        logs: [
          { id: '1', name: 'Water', amount: 500, time: '08:00' },
          { id: '2', name: 'Water', amount: 300, time: '10:30' },
        ],
      },
    ],
    hydrationGoal: 2000,
    journal: [],
    timetable: {
      Monday: { P1: { subject: 'English', room: '' }, P2: { subject: 'Maths', room: '' }, P3: { subject: 'Science', room: '' }, P4: { subject: 'Geography', room: '' }, P5: { subject: 'IT', room: '' } },
      Tuesday: { P1: { subject: 'History', room: '' }, P2: { subject: 'English', room: '' }, P3: { subject: 'Maths', room: '' }, P4: { subject: 'Science', room: '' }, P5: { subject: 'Geography', room: '' } },
      Wednesday: { P1: { subject: 'Maths', room: '' }, P2: { subject: 'IT', room: '' }, P3: { subject: 'English', room: '' }, P4: { subject: 'History', room: '' }, P5: { subject: 'Science', room: '' } },
      Thursday: { P1: { subject: 'Science', room: '' }, P2: { subject: 'Geography', room: '' }, P3: { subject: 'History', room: '' }, P4: { subject: 'IT', room: '' }, P5: { subject: 'Maths', room: '' } },
      Friday: { P1: { subject: 'Geography', room: '' }, P2: { subject: 'Science', room: '' }, P3: { subject: 'IT', room: '' }, P4: { subject: 'English', room: '' }, P5: { subject: 'History', room: '' } },
    },
    finance: {
      balance: 120,
      goal: 500,
      goalName: 'Headphones',
      transactions: [
        { id: '1', type: 'income', amount: 50, category: 'Pocket Money', description: 'Weekly', date: '2026-05-15' },
        { id: '2', type: 'expense', amount: 15, category: 'Food', description: 'Lunch', date: '2026-05-18' },
        { id: '3', type: 'income', amount: 100, category: 'Mowing', description: 'Neighbours lawn', date: '2026-05-20' },
        { id: '4', type: 'expense', amount: 15, category: 'Entertainment', description: 'Game', date: '2026-05-22' },
      ],
    },
  };
}

const STORAGE_KEY = 'shreyash-dashboard-v2';

export function useStore() {
  const [data, setData] = useState<DashboardData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return makeSeed();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage quota exceeded — some data may not be saved');
    }
  }, [data]);

  const set = (fn: (d: DashboardData) => DashboardData) => setData(fn);

  const updateFocus = (focus: string) => set(d => ({ ...d, focus }));
  const updateQuoteDate = (quoteDate: string) => set(d => ({ ...d, quoteDate }));

  // Goals
  const addGoal = (goal: Omit<Goal, 'id' | 'history'>) =>
    set(d => ({ ...d, goals: [...d.goals, { ...goal, id: Date.now().toString(), history: [{ date: dateStr(0), value: goal.current }] }] }));

  const updateGoal = (id: string, value: number) =>
    set(d => ({
      ...d,
      goals: d.goals.map(g => g.id === id
        ? { ...g, current: value, history: [...g.history, { date: dateStr(0), value }] }
        : g),
    }));

  const removeGoal = (id: string) =>
    set(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) }));

  // Subjects
  const updateSubjectProgress = (id: string, progress: number) =>
    set(d => ({ ...d, subjects: d.subjects.map(s => s.id === id ? { ...s, progress } : s) }));

  const updateSubjectNotes = (id: string, notes: string) =>
    set(d => ({ ...d, subjects: d.subjects.map(s => s.id === id ? { ...s, notes } : s) }));

  const updateSubjectAssessment = (id: string, nextAssessment: string) =>
    set(d => ({ ...d, subjects: d.subjects.map(s => s.id === id ? { ...s, nextAssessment } : s) }));

  // Assignments
  const addAssignment = (a: Omit<Assignment, 'id' | 'status'>) =>
    set(d => ({ ...d, assignments: [...d.assignments, { ...a, id: Date.now().toString(), status: 'todo' }] }));

  const toggleAssignment = (id: string) =>
    set(d => ({
      ...d,
      assignments: d.assignments.map(a => a.id === id ? { ...a, status: a.status === 'done' ? 'todo' : 'done' } : a),
    }));

  const removeAssignment = (id: string) =>
    set(d => ({ ...d, assignments: d.assignments.filter(a => a.id !== id) }));

  // Habits
  const toggleHabit = (id: string, ds: string) =>
    set(d => ({
      ...d,
      habits: d.habits.map(h => {
        if (h.id !== id) return h;
        const newHistory = { ...h.history, [ds]: !h.history[ds] };
        const { streak, bestStreak } = computeStreak(newHistory);
        return { ...h, history: newHistory, streak, bestStreak };
      }),
    }));

  const addHabit = (name: string) => {
    const history: Record<string, boolean> = {};
    history[dateStr(0)] = false;
    set(d => ({
      ...d,
      habits: [...d.habits, { id: Date.now().toString(), name, streak: 0, bestStreak: 0, history }],
    }));
  };

  const removeHabit = (id: string) =>
    set(d => ({ ...d, habits: d.habits.filter(h => h.id !== id) }));

  // Sleep
  const addSleep = (entry: Omit<SleepEntry, 'id'>) =>
    set(d => {
      const existing = d.sleep.find(s => s.date === entry.date);
      if (existing) {
        return { ...d, sleep: d.sleep.map(s => s.date === entry.date ? { ...s, ...entry } : s) };
      }
      return { ...d, sleep: [...d.sleep.slice(-13), entry] };
    });

  // Hydration
  const addDrink = (drink: Omit<DrinkLog, 'id'>) =>
    set(d => {
      const today = dateStr(0);
      const existing = d.hydration.find(h => h.date === today);
      const newLog = { ...drink, id: Date.now().toString() };
      if (existing) {
        return {
          ...d,
          hydration: d.hydration.map(h =>
            h.date === today ? { ...h, logs: [...h.logs, newLog] } : h
          ),
        };
      }
      return {
        ...d,
        hydration: [...d.hydration, { date: today, goal: d.hydrationGoal, logs: [newLog] }],
      };
    });

  const removeDrink = (drinkId: string) =>
    set(d => {
      const today = dateStr(0);
      return {
        ...d,
        hydration: d.hydration.map(h =>
          h.date === today ? { ...h, logs: h.logs.filter(l => l.id !== drinkId) } : h
        ),
      };
    });

  const setHydrationGoal = (goal: number) =>
    set(d => ({ ...d, hydrationGoal: goal }));

  // Journal
  const saveJournalEntry = (entry: Omit<JournalEntry, 'id'>) =>
    set(d => {
      const existing = d.journal.find(j => j.date === entry.date);
      if (existing) {
        return { ...d, journal: d.journal.map(j => j.date === entry.date ? { ...j, ...entry } : j) };
      }
      return { ...d, journal: [{ ...entry, id: Date.now().toString() }, ...d.journal] };
    });

  // Timetable
  const updateTimetableCell = (day: string, period: string, cell: TimetableCell) =>
    set(d => ({
      ...d,
      timetable: { ...d.timetable, [day]: { ...d.timetable[day], [period]: cell } },
    }));

  // Finance
  const addTransaction = (t: Omit<Transaction, 'id'>) =>
    set(d => {
      const amount = t.type === 'income' ? +t.amount : -t.amount;
      return {
        ...d,
        finance: {
          ...d.finance,
          balance: +(d.finance.balance + amount).toFixed(2),
          transactions: [{ ...t, id: Date.now().toString(), amount: +t.amount }, ...d.finance.transactions],
        },
      };
    });

  const removeTransaction = (id: string) =>
    set(d => {
      const t = d.finance.transactions.find(tx => tx.id === id);
      if (!t) return d;
      const delta = t.type === 'income' ? -t.amount : t.amount;
      return {
        ...d,
        finance: {
          ...d.finance,
          balance: +(d.finance.balance + delta).toFixed(2),
          transactions: d.finance.transactions.filter(tx => tx.id !== id),
        },
      };
    });

  const updateFinanceGoal = (goal: number, goalName: string) =>
    set(d => ({ ...d, finance: { ...d.finance, goal, goalName } }));

  return {
    data,
    updateFocus,
    updateQuoteDate,
    addGoal,
    updateGoal,
    removeGoal,
    updateSubjectProgress,
    updateSubjectNotes,
    updateSubjectAssessment,
    addAssignment,
    toggleAssignment,
    removeAssignment,
    toggleHabit,
    addHabit,
    removeHabit,
    addSleep,
    addDrink,
    removeDrink,
    setHydrationGoal,
    saveJournalEntry,
    updateTimetableCell,
    addTransaction,
    removeTransaction,
    updateFinanceGoal,
  };
}
