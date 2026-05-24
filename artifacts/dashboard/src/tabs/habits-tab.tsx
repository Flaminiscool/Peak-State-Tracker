import { useStore } from '@/hooks/use-store';
import { Card, CardContent } from '@/components/ui/card';

export function HabitsTab() {
  const { data, toggleHabit } = useStore();
  
  // Generate last 30 days
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Protocols</h2>
        <p className="text-muted-foreground mt-1 font-mono text-sm uppercase tracking-widest">Daily Operating System</p>
      </header>

      <Card className="bg-card/50 border-border overflow-hidden">
        <div className="overflow-x-auto p-6">
          <div className="min-w-[600px]">
            <div className="flex mb-4">
              <div className="w-48 font-mono text-xs text-muted-foreground uppercase tracking-wider font-bold">Habit</div>
              <div className="flex-1 flex justify-between px-2">
                {days.filter((_, i) => i % 5 === 0).map(d => (
                  <div key={d} className="text-[10px] text-muted-foreground font-mono">{d.slice(5)}</div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {data.habits.map((h: any) => (
                <div key={h.id} className="flex items-center gap-4">
                  <div className="w-48 flex justify-between items-center group">
                    <span className="text-sm font-medium">{h.name}</span>
                    <span className="text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      🔥 {h.streak}
                    </span>
                  </div>
                  <div className="flex-1 flex gap-1">
                    {days.map(d => {
                      const isDone = h.history[d];
                      const isToday = d === todayStr;
                      return (
                        <button
                          key={d}
                          onClick={() => toggleHabit(h.id, d)}
                          className={`h-6 flex-1 rounded-sm transition-all ${
                            isDone 
                              ? 'bg-primary border border-primary hover:bg-primary/80' 
                              : 'bg-muted border border-transparent hover:border-primary/50'
                          } ${isToday && !isDone ? 'border-primary/50 border-dashed bg-transparent' : ''}`}
                          title={`${d}: ${isDone ? 'Done' : 'Missed'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.habits.map((h: any) => {
          const isDoneToday = h.history[todayStr];
          return (
            <div 
              key={`card-${h.id}`}
              onClick={() => toggleHabit(h.id, todayStr)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isDoneToday 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{h.name}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isDoneToday ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                  {isDoneToday && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                </div>
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-2 uppercase">
                Streak: {h.streak} | Best: {h.bestStreak}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
