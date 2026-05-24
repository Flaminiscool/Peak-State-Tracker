import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/hooks/use-store';
import { useEffect } from 'react';

const QUOTES = [
  "The successful warrior is the average man, with laser-like focus.",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
  "Discipline equals freedom.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Hard choices, easy life. Easy choices, hard life.",
  "Don't count the days. Make the days count.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Energy and persistence conquer all things.",
  "He who has a why to live can bear almost any how.",
  "The man who moves a mountain begins by carrying away small stones.",
  "What you do today can improve all your tomorrows.",
  "Excellence is not a destination but a continuous journey.",
  "It's not who you are that holds you back, it's who you think you're not.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Stay focused and never give up.",
  "The secret of getting ahead is getting started.",
  "Work hard in silence. Let success make the noise.",
  "Don't stop when you're tired. Stop when you're done.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard is not impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
];

function getDailyQuote(): string {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return QUOTES[seed % QUOTES.length];
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeTab() {
  const { data, updateFocus } = useStore();
  const todayStr = new Date().toISOString().split('T')[0];

  const habitsDone = data.habits.filter(h => h.history[todayStr]).length;
  const activeGoals = data.goals.filter(g => g.current < g.target).length;
  const assignmentsDue = data.assignments.filter(a => a.status !== 'done').length;
  const quote = getDailyQuote();

  const date = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {getGreeting()}, Shreyash.
        </h2>
        <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-widest">{date}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2 bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-primary uppercase tracking-wider">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              data-testid="input-focus"
              placeholder="What's the main thing you need to get done today?"
              className="w-full bg-transparent border-b-2 border-border py-2 outline-none focus:border-primary transition-colors text-lg font-medium"
              value={data.focus}
              onChange={e => updateFocus(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Daily Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="italic border-l-2 border-primary pl-4 text-sm text-foreground/80 leading-relaxed">
              "{quote}"
            </blockquote>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Habits Done"
          value={`${habitsDone}/${data.habits.length}`}
          sub={habitsDone === data.habits.length ? 'All done' : `${data.habits.length - habitsDone} remaining`}
        />
        <StatCard
          label="Active Goals"
          value={String(activeGoals)}
          sub={`${data.goals.length} total`}
        />
        <StatCard
          label="Assignments Due"
          value={String(assignmentsDue)}
          sub={assignmentsDue === 0 ? 'All clear' : 'pending'}
          urgent={assignmentsDue > 0}
        />
        <StatCard
          label="Savings"
          value={`$${data.finance.balance}`}
          sub={`Goal: $${data.finance.goal}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Today's Habits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.habits.map(h => {
              const done = h.history[todayStr];
              return (
                <div key={h.id} className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${done ? 'bg-primary/10 text-primary' : 'bg-muted/40 text-muted-foreground'}`}>
                  <span>{h.name}</span>
                  <span className="font-mono text-xs">{done ? '✓' : '—'}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.assignments.filter(a => a.status !== 'done').slice(0, 5).map(a => {
              const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
              return (
                <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 text-sm">
                  <div>
                    <span className="font-medium">{a.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs font-mono">{a.subject}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${daysLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {daysLeft > 0 ? `${daysLeft}d` : 'OVERDUE'}
                  </span>
                </div>
              );
            })}
            {data.assignments.filter(a => a.status !== 'done').length === 0 && (
              <p className="text-muted-foreground text-sm px-3">No assignments due — nice work.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, urgent }: { label: string; value: string; sub?: string; urgent?: boolean }) {
  return (
    <Card className={`hover:border-primary/50 transition-colors bg-card/30 ${urgent ? 'border-destructive/30' : ''}`}>
      <CardContent className="p-5">
        <div className={`text-3xl font-bold font-mono ${urgent ? 'text-destructive' : 'text-foreground'}`}>{value}</div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{label}</div>
        {sub && <div className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">{sub}</div>}
      </CardContent>
    </Card>
  );
}
