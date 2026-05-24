import { useState, useEffect } from 'react';

// Seed data
const seedData = {
  focus: 'Finish Science Lab Report',
  goals: [
    { id: '1', name: 'Get Band 6 in Maths', category: 'school', target: 100, current: 65, deadline: '2026-11-01', history: [40, 45, 50, 58, 65] },
    { id: '2', name: 'Save for new headphones $300', category: 'finance', target: 300, current: 120, deadline: '2026-08-15', history: [20, 50, 80, 100, 120] },
    { id: '3', name: 'Run 5km', category: 'health', target: 5, current: 3.2, deadline: '2026-06-01', history: [1, 1.5, 2, 2.5, 3.2] },
  ],
  subjects: [
    { id: '1', name: 'English', progress: 40, nextAssessment: '2026-06-10', notes: 'Read chapters 1-4' },
    { id: '2', name: 'Mathematics', progress: 60, nextAssessment: '2026-06-15', notes: 'Practice past papers' },
    { id: '3', name: 'Science', progress: 35, nextAssessment: '2026-06-05', notes: 'Lab report due' },
    { id: '4', name: 'Geography', progress: 50, nextAssessment: '2026-06-20', notes: '' },
    { id: '5', name: 'History', progress: 20, nextAssessment: '2026-07-01', notes: '' },
    { id: '6', name: 'Information Software Technology', progress: 80, nextAssessment: '2026-05-30', notes: 'Project milestone' },
  ],
  assignments: [
    { id: '1', subject: 'English', name: 'English Essay', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'todo' },
    { id: '2', subject: 'Science', name: 'Science Lab Report', dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), status: 'todo' },
  ],
  habits: [
    { id: '1', name: 'Drink 2L Water', streak: 4, bestStreak: 12, history: generateHabitHistory() },
    { id: '2', name: 'Exercise 30min', streak: 1, bestStreak: 5, history: generateHabitHistory() },
    { id: '3', name: 'Read 20min', streak: 0, bestStreak: 8, history: generateHabitHistory() },
    { id: '4', name: 'No phone before bed', streak: 2, bestStreak: 14, history: generateHabitHistory() },
    { id: '5', name: 'Review notes', streak: 5, bestStreak: 5, history: generateHabitHistory() },
  ],
  sleep: [
    { date: 'Mon', hours: 7.5 },
    { date: 'Tue', hours: 6.8 },
    { date: 'Wed', hours: 8.1 },
    { date: 'Thu', hours: 7.2 },
    { date: 'Fri', hours: 6.5 },
    { date: 'Sat', hours: 9.0 },
    { date: 'Sun', hours: 8.5 },
  ],
  finance: {
    balance: 120,
    goal: 500,
    transactions: [
      { id: '1', type: 'income', amount: 50, category: 'Pocket Money', date: '2026-05-15' },
      { id: '2', type: 'expense', amount: 15, category: 'Food', date: '2026-05-18' },
      { id: '3', type: 'income', amount: 100, category: 'Mowing', date: '2026-05-20' },
      { id: '4', type: 'expense', amount: 15, category: 'Entertainment', date: '2026-05-22' },
    ]
  }
};

function generateHabitHistory() {
  const history: Record<string, boolean> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    history[d.toISOString().split('T')[0]] = Math.random() > 0.4;
  }
  return history;
}

export function useStore() {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('shreyash-dashboard');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return seedData;
      }
    }
    return seedData;
  });

  useEffect(() => {
    localStorage.setItem('shreyash-dashboard', JSON.stringify(data));
  }, [data]);

  const updateFocus = (focus: string) => setData((d: any) => ({ ...d, focus }));
  
  const updateGoal = (id: string, current: number) => setData((d: any) => ({
    ...d,
    goals: d.goals.map((g: any) => g.id === id ? { ...g, current, history: [...g.history, current] } : g)
  }));

  const addGoal = (goal: any) => setData((d: any) => ({
    ...d,
    goals: [...d.goals, { ...goal, id: Date.now().toString(), history: [goal.current] }]
  }));

  const updateSubjectNotes = (id: string, notes: string) => setData((d: any) => ({
    ...d,
    subjects: d.subjects.map((s: any) => s.id === id ? { ...s, notes } : s)
  }));

  const toggleAssignment = (id: string) => setData((d: any) => ({
    ...d,
    assignments: d.assignments.map((a: any) => a.id === id ? { ...a, status: a.status === 'done' ? 'todo' : 'done' } : a)
  }));

  const toggleHabit = (id: string, dateStr: string) => setData((d: any) => {
    return {
      ...d,
      habits: d.habits.map((h: any) => {
        if (h.id === id) {
          const newHistory = { ...h.history, [dateStr]: !h.history[dateStr] };
          // basic streak logic omitted for brevity
          return { ...h, history: newHistory };
        }
        return h;
      })
    };
  });

  const addTransaction = (t: any) => setData((d: any) => {
    const amount = t.type === 'income' ? Number(t.amount) : -Number(t.amount);
    return {
      ...d,
      finance: {
        ...d.finance,
        balance: d.finance.balance + amount,
        transactions: [{ ...t, id: Date.now().toString(), amount: Number(t.amount) }, ...d.finance.transactions]
      }
    };
  });

  return {
    data,
    updateFocus,
    updateGoal,
    addGoal,
    updateSubjectNotes,
    toggleAssignment,
    toggleHabit,
    addTransaction
  };
}
