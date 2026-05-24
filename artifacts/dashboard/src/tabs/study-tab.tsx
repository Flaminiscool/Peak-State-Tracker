import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/hooks/use-store';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';
import { Play, Square, RefreshCw, Plus, Trash2, Settings } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = ['P1', 'P2', 'P3', 'P4', 'P5'];

const subjectColors: Record<string, string> = {
  English: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Mathematics: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Science: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Geography: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  History: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Information Technology': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

function getSubjectColor(name: string) {
  return subjectColors[name] || 'bg-muted text-muted-foreground border-border';
}

export function StudyTab() {
  const { data, updateSubjectNotes, updateSubjectProgress, toggleAssignment, addAssignment, removeAssignment, updateTimetableCell } = useStore();
  const [view, setView] = useState<'subjects' | 'timetable'>('subjects');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', name: '', dueDate: '' });
  const [editingCell, setEditingCell] = useState<{ day: string; period: string } | null>(null);
  const [cellForm, setCellForm] = useState({ subject: '', room: '' });

  const handleAddAssignment = () => {
    if (!form.name || !form.dueDate) return;
    addAssignment({ subject: form.subject || 'General', name: form.name, dueDate: form.dueDate });
    setForm({ subject: '', name: '', dueDate: '' });
    setAddOpen(false);
  };

  const openCellEdit = (day: string, period: string) => {
    const cell = data.timetable[day]?.[period] || { subject: '', room: '' };
    setCellForm({ subject: cell.subject, room: cell.room });
    setEditingCell({ day, period });
  };

  const saveCellEdit = () => {
    if (!editingCell) return;
    updateTimetableCell(editingCell.day, editingCell.period, cellForm);
    setEditingCell(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Curriculum</h2>
          <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-widest">Year 10 NSW</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'subjects' ? 'default' : 'outline'}
            size="sm"
            className="font-mono text-xs uppercase"
            onClick={() => setView('subjects')}
          >
            Subjects
          </Button>
          <Button
            variant={view === 'timetable' ? 'default' : 'outline'}
            size="sm"
            className="font-mono text-xs uppercase"
            onClick={() => setView('timetable')}
          >
            Timetable
          </Button>
        </div>
      </header>

      {view === 'timetable' && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-xs font-mono">Click any cell to edit your timetable.</p>
          <Card className="bg-card/50 border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-[10px] font-mono text-muted-foreground uppercase tracking-wider w-24">Period</th>
                    {DAYS.map(day => (
                      <th key={day} className="text-left px-4 py-3 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        {day.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map(period => (
                    <tr key={period} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-2 text-xs font-mono text-muted-foreground font-bold">{period}</td>
                      {DAYS.map(day => {
                        const cell = data.timetable[day]?.[period] || { subject: '', room: '' };
                        return (
                          <td key={day} className="px-2 py-1.5">
                            <button
                              data-testid={`timetable-${day}-${period}`}
                              onClick={() => openCellEdit(day, period)}
                              className={`w-full text-left px-3 py-2 rounded text-xs font-medium border transition-all hover:opacity-80 ${
                                cell.subject ? getSubjectColor(cell.subject) : 'bg-muted/20 text-muted-foreground border-transparent hover:border-border'
                              }`}
                            >
                              {cell.subject || <span className="opacity-30">—</span>}
                              {cell.room && <span className="block text-[9px] opacity-60 mt-0.5">{cell.room}</span>}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Dialog open={!!editingCell} onOpenChange={open => !open && setEditingCell(null)}>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle className="font-mono text-sm uppercase">
                  Edit {editingCell?.day} {editingCell?.period}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <Input
                  placeholder="Subject"
                  value={cellForm.subject}
                  onChange={e => setCellForm(f => ({ ...f, subject: e.target.value }))}
                  autoFocus
                />
                <Input
                  placeholder="Room (optional)"
                  value={cellForm.room}
                  onChange={e => setCellForm(f => ({ ...f, room: e.target.value }))}
                />
                <Button className="w-full font-mono uppercase text-xs" onClick={saveCellEdit}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {view === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.subjects.map(s => (
                <Card key={s.id} className="bg-card/50 border-border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-bold">{s.name}</CardTitle>
                      <span className="text-xs font-mono text-muted-foreground font-bold">{s.progress}%</span>
                    </div>
                    <Progress value={s.progress} className="h-1.5 mt-2" />
                    <div className="mt-2">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[s.progress]}
                        onValueChange={([v]) => updateSubjectProgress(s.id, v)}
                        className="w-full"
                        data-testid={`slider-subject-${s.id}`}
                      />
                      <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-1">
                        <span>0%</span><span>100%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="text-[10px] text-muted-foreground font-mono">
                      NEXT ASSESSMENT: {new Date(s.nextAssessment).toLocaleDateString('en-AU')}
                    </div>
                    <Textarea
                      placeholder="Notes..."
                      className="h-16 text-xs bg-background/50 resize-none font-mono"
                      value={s.notes}
                      onChange={e => updateSubjectNotes(s.id, e.target.value)}
                      data-testid={`textarea-subject-notes-${s.id}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <PomodoroTimer />

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">Assignments</h3>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-mono gap-1" data-testid="button-add-assignment">
                      <Plus size={12} /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xs">
                    <DialogHeader>
                      <DialogTitle className="font-mono text-sm uppercase">New Assignment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                      <Input
                        placeholder="Assignment name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        data-testid="input-assignment-name"
                        autoFocus
                      />
                      <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
                        <SelectTrigger className="font-mono text-xs"><SelectValue placeholder="Subject" /></SelectTrigger>
                        <SelectContent>
                          {data.subjects.map(s => (
                            <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                          ))}
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="date"
                        value={form.dueDate}
                        onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                        data-testid="input-assignment-due"
                      />
                      <Button className="w-full font-mono uppercase text-xs" onClick={handleAddAssignment}>Add Assignment</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {data.assignments.length === 0 && (
                  <p className="text-muted-foreground text-xs font-mono px-1">No assignments — you're clear.</p>
                )}
                {data.assignments.map(a => {
                  const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
                  return (
                    <div key={a.id} data-testid={`assignment-${a.id}`} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/30 group">
                      <Checkbox
                        checked={a.status === 'done'}
                        onCheckedChange={() => toggleAssignment(a.id)}
                        className="mt-0.5"
                        data-testid={`checkbox-assignment-${a.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${a.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {a.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5">{a.subject}</Badge>
                          <span className={`text-[10px] font-mono ${daysLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {daysLeft > 0 ? `${daysLeft}d left` : 'OVERDUE'}
                          </span>
                        </div>
                      </div>
                      <button
                        data-testid={`button-remove-assignment-${a.id}`}
                        onClick={() => removeAssignment(a.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-0.5 shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PomodoroTimer() {
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggle = () => setIsRunning(r => !r);
  const reset = () => { setIsRunning(false); setTimeLeft(mode === 'work' ? workMins * 60 : breakMins * 60); };
  const switchMode = (m: 'work' | 'break') => { setMode(m); setIsRunning(false); setTimeLeft(m === 'work' ? workMins * 60 : breakMins * 60); };
  const applySettings = () => { setTimeLeft(mode === 'work' ? workMins * 60 : breakMins * 60); setIsRunning(false); setShowSettings(false); };

  const totalSecs = mode === 'work' ? workMins * 60 : breakMins * 60;
  const pct = ((totalSecs - timeLeft) / totalSecs) * 100;
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Focus Timer</CardTitle>
          <button
            data-testid="button-timer-settings"
            onClick={() => setShowSettings(s => !s)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings size={13} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-center space-y-4">
        {showSettings && (
          <div className="bg-card/50 rounded-lg p-3 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Work</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={workMins}
                  onChange={e => setWorkMins(Math.max(1, Number(e.target.value)))}
                  className="w-14 h-6 text-xs font-mono text-center p-1"
                  data-testid="input-work-mins"
                />
                <span className="text-muted-foreground">min</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Break</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={breakMins}
                  onChange={e => setBreakMins(Math.max(1, Number(e.target.value)))}
                  className="w-14 h-6 text-xs font-mono text-center p-1"
                  data-testid="input-break-mins"
                />
                <span className="text-muted-foreground">min</span>
              </div>
            </div>
            <Button size="sm" className="w-full h-7 text-xs font-mono uppercase" onClick={applySettings}>Apply</Button>
          </div>
        )}

        <div className="flex justify-center gap-2">
          {(['work', 'break'] as const).map(m => (
            <button
              key={m}
              data-testid={`timer-mode-${m}`}
              onClick={() => switchMode(m)}
              className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m === 'work' ? `Focus ${workMins}m` : `Break ${breakMins}m`}
            </button>
          ))}
        </div>

        <div className="relative w-28 h-28 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="hsl(var(--primary))" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold tracking-tighter">{mins}:{secs}</span>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            data-testid="button-timer-toggle"
            variant={isRunning ? 'destructive' : 'default'}
            className="w-9 h-9"
            onClick={toggle}
          >
            {isRunning ? <Square size={14} /> : <Play size={14} />}
          </Button>
          <Button size="icon" variant="outline" className="w-9 h-9" onClick={reset} data-testid="button-timer-reset">
            <RefreshCw size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
