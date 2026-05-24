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

export type Assessment = {
  id: string;
  term: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  distributedDate: string;
  dueDate: string;
  weight: number;
  mark: number | null;
  outOf: number | null;
  fileUrl: string;
};

export type Subject = {
  id: string;
  name: string;
  teacher: string;
  room: string;
  progress: number;
  notes: string;
  assessments: Assessment[];
};

export type Assignment = {
  id: string;
  subject: string;
  name: string;
  description: string;
  url: string;
  dueDate: string;
  status: 'todo' | 'done';
};

export type Habit = {
  id: string;
  name: string;
  streak: number;
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

export type JournalMedia = { type: 'image'; data: string } | { type: 'video'; url: string; title: string };

export type JournalEntry = {
  id: string;
  date: string;
  events: string;
  growth: string;
  plan: string;
  emotions: string[];
  mood: number;
  media: JournalMedia[];
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
};

export type TimetableCell = { subject: string; room: string; teacher: string };
export type WeekTimetable = Record<string, Record<string, TimetableCell>>;

export type DashboardData = {
  focus: string;
  goals: Goal[];
  subjects: Subject[];
  assignments: Assignment[];
  habits: Habit[];
  sleep: SleepEntry[];
  hydration: HydrationDay[];
  hydrationGoal: number;
  journal: JournalEntry[];
  timetable: { A: WeekTimetable; B: WeekTimetable };
  finance: { balance: number; goal: number; goalName: string; transactions: Transaction[] };
};

function ds(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
}

export function computeStreak(history: Record<string, boolean>) {
  let streak = 0;
  const cur = new Date();
  while (true) {
    const key = cur.toISOString().split('T')[0];
    if (history[key]) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

const CELL = (subject: string, room = '', teacher = ''): TimetableCell => ({ subject, room, teacher });
const EMPTY = (): TimetableCell => ({ subject: '', room: '', teacher: '' });

function makeSeed(): DashboardData {
  const subjects: Subject[] = [
    { id: '1', name: 'English', teacher: 'Mr Michael Jung', room: '11', progress: 40, notes: '', assessments: [] },
    { id: '2', name: 'Mathematics', teacher: 'Ms Jessica Yu', room: '05-FFL', progress: 55, notes: '', assessments: [] },
    { id: '3', name: 'Science', teacher: 'Mr Davendra Goundar', room: '36-LAB', progress: 35, notes: '', assessments: [] },
    { id: '4', name: 'History', teacher: 'Ms Trisha Millhouse', room: '16_A', progress: 30, notes: '', assessments: [] },
    { id: '5', name: 'Computing Technology', teacher: 'Mr Rajneel Prasad', room: '04-COM', progress: 70, notes: '', assessments: [] },
    { id: '6', name: 'Music', teacher: 'Mr Benjamin Secrett', room: '41-MUS', progress: 50, notes: '', assessments: [] },
    { id: '7', name: 'PDHPE', teacher: 'Miss Nurcan Yikilmaz', room: '', progress: 45, notes: '', assessments: [] },
    { id: '8', name: 'Sport', teacher: 'Ms Chrystal Player', room: 'C3', progress: 60, notes: '', assessments: [] },
  ];

  const weekA: WeekTimetable = {
    Monday: {
      P1: EMPTY(), P2: EMPTY(), P3: EMPTY(), P4: EMPTY(), P5: EMPTY(),
    },
    Tuesday: {
      P1: CELL('Music', '41-MUS', 'Mr Benjamin Secrett'),
      P2: CELL('Science', '36-LAB', 'Mr Davendra Goundar'),
      P3: CELL('Mathematics', '05-FFL', 'Ms Jessica Yu'),
      P4: EMPTY(),
      P5: CELL('English', '11', 'Mr Michael Jung'),
    },
    Wednesday: {
      P1: CELL('Science', 'DM_6', 'Mr Davendra Goundar'),
      P2: CELL('English', 'DM_3', 'Mr Michael Jung'),
      P3: CELL('Computing Technology', '04-COM', 'Mr Rajneel Prasad'),
      P4: CELL('Computing Technology', '04-COM', 'Mr Rajneel Prasad'),
      P5: CELL('History', '16_A', 'Ms Trisha Millhouse'),
    },
    Thursday: {
      P1: CELL('History', '17', 'Mr Mahmoud Hammoud'),
      P2: CELL('Computing Technology', '04-COM', 'Mr Rajneel Prasad'),
      P3: CELL('Music', '41-MUS', 'Mr Benjamin Secrett'),
      P4: CELL('Mathematics', '05-FFL', 'Ms Jessica Yu'),
      P5: CELL('History', '16_A', 'Ms Trisha Millhouse'),
    },
    Friday: {
      P1: CELL('Computing Technology', '04-COM', 'Mr Rajneel Prasad'),
      P2: CELL('Computing Technology', '04-COM', 'Mr Rajneel Prasad'),
      P3: CELL('Music', '41-MUS', 'Mr Benjamin Secrett'),
      P4: CELL('Mathematics', '05-FFL', 'Ms Jessica Yu'),
      P5: CELL('Science', 'DM_8', 'Mr Davendra Goundar'),
    },
  };

  const weekB: WeekTimetable = {
    Monday: {
      P1: CELL('PDHPE', '26', 'Mr Christopher Kavaliauskas'),
      P2: CELL('Sport', 'C3', 'Ms Chrystal Player'),
      P3: CELL('Sport', 'C3', 'Ms Chrystal Player'),
      P4: CELL('History', '16_A', 'Ms Trisha Millhouse'),
      P5: CELL('History', '16_A', 'Ms Trisha Millhouse'),
    },
    Tuesday: {
      P1: CELL('PDHPE', 'DM_8', 'Miss Nurcan Yikilmaz'),
      P2: CELL('English', '11', 'Mr Michael Jung'),
      P3: CELL('English', '11', 'Mr Michael Jung'),
      P4: CELL('Music', '41-MUS', 'Mr Benjamin Secrett'),
      P5: CELL('Computing Technology', '04-COM', 'Mr Rajneel Prasad'),
    },
    Wednesday: {
      P1: CELL('Mathematics', '05-FFL', 'Ms Jessica Yu'),
      P2: CELL('English', '16_A', 'Mr Michael Jung'),
      P3: CELL('Science', '36-LAB', 'Mr Davendra Goundar'),
      P4: EMPTY(),
      P5: CELL('English', '14', 'Mr Michael Jung'),
    },
    Thursday: {
      P1: CELL('History', '17', 'Mr Mahmoud Hammoud'),
      P2: CELL('Science', 'DM_5', 'Mr Davendra Goundar'),
      P3: CELL('History', '16_A', 'Ms Trisha Millhouse'),
      P4: CELL('Mathematics', '05-FFL', 'Ms Jessica Yu'),
      P5: CELL('Computing Technology', '04-COM', 'Mr Rajneel Prasad'),
    },
    Friday: {
      P1: CELL('Science', '36-LAB', 'Mr Davendra Goundar'),
      P2: CELL('Mathematics', '05-FFL', 'Ms Jessica Yu'),
      P3: CELL('Music', '41-MUS', 'Mr Benjamin Secrett'),
      P4: CELL('Music', '41-MUS', 'Mr Benjamin Secrett'),
      P5: CELL('Mathematics', '05-FFL', 'Ms Jessica Yu'),
    },
  };

  return {
    focus: '',
    goals: [],
    subjects,
    assignments: [],
    habits: [
      { id: '1', name: 'Drink 2L Water', streak: 0, history: {} },
      { id: '2', name: 'Exercise 30min', streak: 0, history: {} },
      { id: '3', name: 'Read 20min', streak: 0, history: {} },
      { id: '4', name: 'No phone before bed', streak: 0, history: {} },
      { id: '5', name: 'Review notes', streak: 0, history: {} },
    ],
    sleep: [],
    hydration: [],
    hydrationGoal: 2000,
    journal: [],
    timetable: { A: weekA, B: weekB },
    finance: {
      balance: 0,
      goal: 500,
      goalName: 'Savings Goal',
      transactions: [],
    },
  };
}

const STORAGE_KEY = 'shreyash-dashboard-v3';

export function useStore() {
  const [data, setData] = useState<DashboardData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure journal entries have media field (migration)
        if (parsed.journal) {
          parsed.journal = parsed.journal.map((j: any) => ({
            ...j,
            media: j.media || (j.images ? j.images.map((img: string) => ({ type: 'image', data: img })) : []),
          }));
        }
        return parsed;
      }
    } catch {}
    return makeSeed();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      console.warn('Storage quota exceeded');
    }
  }, [data]);

  const upd = (fn: (d: DashboardData) => DashboardData) => setData(fn);

  const updateFocus = (focus: string) => upd(d => ({ ...d, focus }));

  // Goals
  const addGoal = (goal: Omit<Goal, 'id' | 'history'>) =>
    upd(d => ({
      ...d,
      goals: [...d.goals, {
        ...goal,
        id: Date.now().toString(),
        history: [{ date: ds(0), value: 0 }],
      }],
    }));

  const updateGoal = (id: string, value: number) =>
    upd(d => ({
      ...d,
      goals: d.goals.map(g => g.id === id
        ? { ...g, current: value, history: [...g.history, { date: ds(0), value }] }
        : g),
    }));

  const removeGoal = (id: string) => upd(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) }));

  // Subjects
  const updateSubjectProgress = (id: string, progress: number) =>
    upd(d => ({ ...d, subjects: d.subjects.map(s => s.id === id ? { ...s, progress } : s) }));

  const updateSubjectNotes = (id: string, notes: string) =>
    upd(d => ({ ...d, subjects: d.subjects.map(s => s.id === id ? { ...s, notes } : s) }));

  // Assessments
  const addAssessment = (subjectId: string, a: Omit<Assessment, 'id'>) =>
    upd(d => ({
      ...d,
      subjects: d.subjects.map(s => s.id === subjectId
        ? { ...s, assessments: [...s.assessments, { ...a, id: Date.now().toString() }] }
        : s),
    }));

  const updateAssessmentMark = (subjectId: string, assessmentId: string, mark: number | null, outOf: number | null) =>
    upd(d => ({
      ...d,
      subjects: d.subjects.map(s => s.id === subjectId
        ? {
            ...s,
            assessments: s.assessments.map(a =>
              a.id === assessmentId ? { ...a, mark, outOf } : a
            ),
          }
        : s),
    }));

  const removeAssessment = (subjectId: string, assessmentId: string) =>
    upd(d => ({
      ...d,
      subjects: d.subjects.map(s => s.id === subjectId
        ? { ...s, assessments: s.assessments.filter(a => a.id !== assessmentId) }
        : s),
    }));

  // Assignments
  const addAssignment = (a: Omit<Assignment, 'id' | 'status'>) =>
    upd(d => ({ ...d, assignments: [...d.assignments, { ...a, id: Date.now().toString(), status: 'todo' }] }));

  const toggleAssignment = (id: string) =>
    upd(d => ({
      ...d,
      assignments: d.assignments.map(a => a.id === id ? { ...a, status: a.status === 'done' ? 'todo' : 'done' } : a),
    }));

  const removeAssignment = (id: string) =>
    upd(d => ({ ...d, assignments: d.assignments.filter(a => a.id !== id) }));

  // Habits
  const toggleHabit = (id: string, dateStr: string) =>
    upd(d => ({
      ...d,
      habits: d.habits.map(h => {
        if (h.id !== id) return h;
        const newHistory = { ...h.history, [dateStr]: !h.history[dateStr] };
        return { ...h, history: newHistory, streak: computeStreak(newHistory) };
      }),
    }));

  const addHabit = (name: string) =>
    upd(d => ({
      ...d,
      habits: [...d.habits, { id: Date.now().toString(), name, streak: 0, history: {} }],
    }));

  const removeHabit = (id: string) =>
    upd(d => ({ ...d, habits: d.habits.filter(h => h.id !== id) }));

  // Sleep
  const addSleep = (entry: SleepEntry) =>
    upd(d => {
      const existing = d.sleep.find(s => s.date === entry.date);
      if (existing) return { ...d, sleep: d.sleep.map(s => s.date === entry.date ? entry : s) };
      return { ...d, sleep: [...d.sleep.slice(-20), entry].sort((a, b) => a.date.localeCompare(b.date)) };
    });

  // Hydration
  const addDrink = (drink: Omit<DrinkLog, 'id'>) =>
    upd(d => {
      const today = ds(0);
      const newLog: DrinkLog = { ...drink, id: Date.now().toString() };
      const existing = d.hydration.find(h => h.date === today);
      if (existing) {
        return { ...d, hydration: d.hydration.map(h => h.date === today ? { ...h, logs: [...h.logs, newLog] } : h) };
      }
      return { ...d, hydration: [...d.hydration, { date: today, goal: d.hydrationGoal, logs: [newLog] }] };
    });

  const removeDrink = (drinkId: string) =>
    upd(d => {
      const today = ds(0);
      return { ...d, hydration: d.hydration.map(h => h.date === today ? { ...h, logs: h.logs.filter(l => l.id !== drinkId) } : h) };
    });

  const setHydrationGoal = (goal: number) => upd(d => ({ ...d, hydrationGoal: goal }));

  // Journal
  const saveJournalEntry = (entry: Omit<JournalEntry, 'id'>) =>
    upd(d => {
      const existing = d.journal.find(j => j.date === entry.date);
      if (existing) return { ...d, journal: d.journal.map(j => j.date === entry.date ? { ...j, ...entry } : j) };
      return { ...d, journal: [{ ...entry, id: Date.now().toString() }, ...d.journal] };
    });

  // Timetable
  const updateTimetableCell = (week: 'A' | 'B', day: string, period: string, cell: TimetableCell) =>
    upd(d => ({
      ...d,
      timetable: {
        ...d.timetable,
        [week]: { ...d.timetable[week], [day]: { ...d.timetable[week][day], [period]: cell } },
      },
    }));

  // Finance
  const addTransaction = (t: Omit<Transaction, 'id'>) =>
    upd(d => {
      const delta = t.type === 'income' ? +t.amount : -t.amount;
      return {
        ...d,
        finance: {
          ...d.finance,
          balance: +(d.finance.balance + delta).toFixed(2),
          transactions: [{ ...t, id: Date.now().toString(), amount: +t.amount }, ...d.finance.transactions],
        },
      };
    });

  const removeTransaction = (id: string) =>
    upd(d => {
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
    upd(d => ({ ...d, finance: { ...d.finance, goal, goalName } }));

  return {
    data,
    updateFocus,
    addGoal, updateGoal, removeGoal,
    updateSubjectProgress, updateSubjectNotes,
    addAssessment, updateAssessmentMark, removeAssessment,
    addAssignment, toggleAssignment, removeAssignment,
    toggleHabit, addHabit, removeHabit,
    addSleep,
    addDrink, removeDrink, setHydrationGoal,
    saveJournalEntry,
    updateTimetableCell,
    addTransaction, removeTransaction, updateFinanceGoal,
  };
}
