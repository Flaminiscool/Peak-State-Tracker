import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/hooks/use-store';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { Play, Square, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StudyTab() {
  const { data, updateSubjectNotes, toggleAssignment } = useStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Curriculum & Study</h2>
        <p className="text-muted-foreground mt-1 font-mono text-sm uppercase tracking-widest">Year 10 NSW</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold border-b border-border pb-2">Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.subjects.map((s: any) => (
              <Card key={s.id} className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md font-bold">{s.name}</CardTitle>
                    <span className="text-xs font-mono text-muted-foreground">{s.progress}%</span>
                  </div>
                  <Progress value={s.progress} className="h-1 mt-2" />
                </CardHeader>
                <CardContent className="space-y-2 pt-2">
                  <div className="text-xs text-muted-foreground font-mono">
                    NEXT ASSESS: {new Date(s.nextAssessment).toLocaleDateString()}
                  </div>
                  <Textarea 
                    placeholder="Quick notes..." 
                    className="h-20 text-xs bg-background/50 resize-none font-mono"
                    value={s.notes}
                    onChange={(e) => updateSubjectNotes(s.id, e.target.value)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <PomodoroTimer />
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-border pb-2">Assignments</h3>
            <div className="space-y-2">
              {data.assignments.map((a: any) => {
                const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/30">
                    <Checkbox 
                      checked={a.status === 'done'} 
                      onCheckedChange={() => toggleAssignment(a.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${a.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {a.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{a.subject}</Badge>
                        <span className={`text-[10px] font-mono ${daysLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {daysLeft > 0 ? `${daysLeft}d left` : 'OVERDUE'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggle = () => setIsRunning(!isRunning);
  
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (m: 'work' | 'break') => {
    setMode(m);
    setIsRunning(false);
    setTimeLeft(m === 'work' ? 25 * 60 : 5 * 60);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex justify-center gap-2 mb-2">
          <Badge variant={mode === 'work' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => switchMode('work')}>Focus</Badge>
          <Badge variant={mode === 'break' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => switchMode('break')}>Break</Badge>
        </div>
        <div className="text-5xl font-mono font-bold tracking-tighter text-foreground">
          {mins}:{secs}
        </div>
        <div className="flex justify-center gap-2">
          <Button size="icon" variant={isRunning ? "destructive" : "default"} onClick={toggle}>
            {isRunning ? <Square size={16} /> : <Play size={16} />}
          </Button>
          <Button size="icon" variant="outline" onClick={reset}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
