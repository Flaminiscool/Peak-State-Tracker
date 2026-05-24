import { useStore } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Plus, Trash2, Flame } from 'lucide-react';

export function HabitsTab() {
  const { data, toggleHabit, addHabit, removeHabit } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHabit(newName.trim());
    setNewName('');
    setAddOpen(false);
  };

  const totalDoneToday = data.habits.filter(h => h.history[todayStr]).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Protocols</h2>
          <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-widest">
            Daily Operating System — {totalDoneToday}/{data.habits.length} done today
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-mono text-xs uppercase gap-1" data-testid="button-add-habit">
              <Plus size={14} /> Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle className="font-mono uppercase tracking-wide text-sm">New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input
                placeholder="e.g. Meditate 10min"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                data-testid="input-habit-name"
                autoFocus
              />
              <Button className="w-full font-mono uppercase text-xs" onClick={handleAdd}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {data.habits.length === 0 && (
        <div className="text-center py-20 text-muted-foreground font-mono text-sm">
          No habits yet. Add one to start tracking.
        </div>
      )}

      {/* Heatmap grid */}
      <Card className="bg-card/50 border-border overflow-hidden">
        <div className="overflow-x-auto p-6">
          <div className="min-w-[580px]">
            <div className="flex mb-4">
              <div className="w-52 shrink-0 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Habit</div>
              <div className="flex-1 flex justify-between px-0.5">
                {days.filter((_, i) => i % 5 === 0).map(d => (
                  <div key={d} className="text-[9px] text-muted-foreground font-mono">{d.slice(5)}</div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {data.habits.map(h => (
                <div key={h.id} className="flex items-center gap-3">
                  <div className="w-52 shrink-0 flex justify-between items-center">
                    <span className="text-sm font-medium truncate pr-2">{h.name}</span>
                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground shrink-0">
                      <Flame size={11} className="text-orange-500" />
                      {h.streak}
                    </div>
                  </div>
                  <div className="flex-1 flex gap-0.5">
                    {days.map(d => {
                      const isDone = h.history[d];
                      const isToday = d === todayStr;
                      return (
                        <button
                          key={d}
                          data-testid={`habit-cell-${h.id}-${d}`}
                          onClick={() => toggleHabit(h.id, d)}
                          className={`h-5 flex-1 rounded-sm transition-all ${
                            isDone
                              ? 'bg-primary hover:bg-primary/80'
                              : isToday
                              ? 'bg-muted border border-dashed border-primary/50 hover:border-primary'
                              : 'bg-muted/40 hover:bg-muted'
                          }`}
                          title={`${d}: ${isDone ? 'Done' : 'Missed'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-muted-foreground">
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-sm bg-muted/40" />
                <div className="w-3 h-3 rounded-sm bg-primary/40" />
                <div className="w-3 h-3 rounded-sm bg-primary" />
              </div>
              <span>Less — More</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Habit cards — today's check-ins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.habits.map(h => {
          const isDoneToday = h.history[todayStr];
          return (
            <div
              key={`card-${h.id}`}
              data-testid={`card-habit-${h.id}`}
              className={`p-4 border rounded-lg transition-all ${
                isDoneToday
                  ? 'border-primary bg-primary/8'
                  : 'border-border bg-card/50 hover:border-primary/40'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm leading-tight pr-2">{h.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    data-testid={`button-toggle-habit-${h.id}`}
                    onClick={() => toggleHabit(h.id, todayStr)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isDoneToday ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {isDoneToday && <span className="text-[10px] font-bold">✓</span>}
                  </button>
                  <button
                    data-testid={`button-remove-habit-${h.id}`}
                    onClick={() => removeHabit(h.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-2 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Flame size={11} className="text-orange-500" />
                  {h.streak} streak
                </span>
                <span>Best: {h.bestStreak}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
