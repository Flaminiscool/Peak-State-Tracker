import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/hooks/use-store';
import { useState, useEffect } from 'react';

const quotes = [
  "The successful warrior is the average man, with laser-like focus.",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
  "Discipline equals freedom.",
  "You do not rise to the level of your goals. You fall to the level of your systems."
];

export function HomeTab() {
  const { data, updateFocus } = useStore();
  const date = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  const todayStr = new Date().toISOString().split('T')[0];
  const habitsDone = data.habits.filter((h: any) => h.history[todayStr]).length;
  const activeGoals = data.goals.filter((g: any) => g.current < g.target).length;
  
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  useEffect(() => {
    setQuoteIndex(new Date().getDay() % quotes.length);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Good morning, Shreyash.</h2>
        <p className="text-muted-foreground mt-1 font-mono text-sm uppercase tracking-widest">{date}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2 bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <input 
              type="text" 
              placeholder="What's the main focus today?" 
              className="w-full bg-transparent border-b-2 border-border py-2 outline-none focus:border-primary transition-colors text-xl font-medium"
              value={data.focus}
              onChange={(e) => updateFocus(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Daily Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="italic border-l-2 border-primary pl-4 text-sm text-foreground/80">
              "{quotes[quoteIndex]}"
            </blockquote>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Habits Done" value={`${habitsDone}/${data.habits.length}`} />
        <StatCard label="Active Goals" value={activeGoals.toString()} />
        <StatCard label="Assignments Due" value={data.assignments.filter((a:any) => a.status !== 'done').length.toString()} />
        <StatCard label="Savings" value={`$${data.finance.balance}`} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <Card className="hover:border-primary/50 transition-colors bg-card/30">
      <CardContent className="p-6">
        <div className="text-3xl font-bold text-foreground font-mono">{value}</div>
        <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-bold">{label}</div>
      </CardContent>
    </Card>
  );
}
