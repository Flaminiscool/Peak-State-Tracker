import { useStore, JournalEntry } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { useState, useRef } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Info } from 'lucide-react';

type HealthView = 'sleep' | 'hydration' | 'journal';

const EMOTIONS = ['Excited', 'Grateful', 'Stressed', 'Anxious', 'Happy', 'Sad', 'Angry', 'Focused', 'Tired', 'Proud'];

const DRINK_PRESETS = [
  { name: 'Water', amount: 250 },
  { name: 'Water', amount: 500 },
  { name: 'Coffee', amount: 250 },
  { name: 'Tea', amount: 250 },
  { name: 'Sports Drink', amount: 500 },
  { name: 'Juice', amount: 250 },
];

function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
}

export function HealthTab() {
  const { data, addSleep, addDrink, removeDrink, setHydrationGoal, saveJournalEntry } = useStore();
  const [view, setView] = useState<HealthView>('sleep');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Biometrics</h2>
          <p className="text-muted-foreground mt-1 font-mono text-xs uppercase tracking-widest">Health & Wellbeing</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {(['sleep', 'hydration', 'journal'] as HealthView[]).map(v => (
            <Button
              key={v}
              variant={view === v ? 'default' : 'outline'}
              size="sm"
              className="font-mono text-xs uppercase"
              onClick={() => setView(v)}
              data-testid={`tab-health-${v}`}
            >
              {v}
            </Button>
          ))}
        </div>
      </header>

      {view === 'sleep' && <SleepView data={data} addSleep={addSleep} />}
      {view === 'hydration' && <HydrationView data={data} addDrink={addDrink} removeDrink={removeDrink} setHydrationGoal={setHydrationGoal} />}
      {view === 'journal' && <JournalView data={data} saveJournalEntry={saveJournalEntry} />}
    </div>
  );
}

function SleepView({ data, addSleep }: { data: any; addSleep: any }) {
  const [bedtime, setBedtime] = useState('22:30');
  const [waketime, setWaketime] = useState('06:30');
  const [date, setDate] = useState(dateStr(0));

  const calcHours = () => {
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = waketime.split(':').map(Number);
    let h = (wh + wm / 60) - (bh + bm / 60);
    if (h < 0) h += 24;
    return +h.toFixed(1);
  };

  const handleLog = () => {
    const hours = calcHours();
    const d = new Date(date);
    const label = d.toLocaleDateString('en-AU', { weekday: 'short' });
    addSleep({ date, label, hours });
  };

  const last7 = data.sleep.slice(-7);

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Sleep — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}>
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 11, fontFamily: 'monospace' }}
                  formatter={(v: number) => [`${v}h`, 'Sleep']}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {last7.length > 0 && (
            <div className="flex gap-6 mt-4 text-center">
              <div>
                <div className="text-2xl font-mono font-bold">{(last7.reduce((s: number, e: any) => s + e.hours, 0) / last7.length).toFixed(1)}h</div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase">Avg</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold">{Math.max(...last7.map((e: any) => e.hours))}h</div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase">Best</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold">{Math.min(...last7.map((e: any) => e.hours))}h</div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase">Least</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Log Sleep</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground uppercase">Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="font-mono text-xs" data-testid="input-sleep-date" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground uppercase">Bedtime</label>
            <Input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} className="font-mono text-xs" data-testid="input-bedtime" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground uppercase">Wake</label>
            <Input type="time" value={waketime} onChange={e => setWaketime(e.target.value)} className="font-mono text-xs" data-testid="input-waketime" />
          </div>
          <Button className="font-mono uppercase text-xs" onClick={handleLog} data-testid="button-log-sleep">
            Log {calcHours()}h
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/50">
        <Info size={13} className="mt-0.5 shrink-0 text-primary/70" />
        <span>
          Fitbit Inspire sync requires OAuth credentials from Fitbit's developer portal. Until then, log your sleep manually above — data is saved locally.
        </span>
      </div>
    </div>
  );
}

function HydrationView({ data, addDrink, removeDrink, setHydrationGoal }: { data: any; addDrink: any; removeDrink: any; setHydrationGoal: any }) {
  const [customName, setCustomName] = useState('');
  const [customAmt, setCustomAmt] = useState('');
  const [goalEdit, setGoalEdit] = useState(false);
  const [goalVal, setGoalVal] = useState(String(data.hydrationGoal));

  const today = dateStr(0);
  const todayLog = data.hydration.find((h: any) => h.date === today) || { date: today, goal: data.hydrationGoal, logs: [] };
  const totalToday = todayLog.logs.reduce((s: number, l: any) => s + l.amount, 0);
  const pct = Math.min(100, Math.round((totalToday / data.hydrationGoal) * 100));

  const handleCustom = () => {
    if (!customAmt) return;
    addDrink({ name: customName || 'Water', amount: Number(customAmt), time: new Date().toTimeString().slice(0, 5) });
    setCustomName('');
    setCustomAmt('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Today's Hydration</CardTitle>
              <button
                onClick={() => setGoalEdit(g => !g)}
                className="text-[10px] font-mono text-muted-foreground hover:text-foreground"
                data-testid="button-edit-goal"
              >
                Goal: {data.hydrationGoal}ml
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalEdit && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={goalVal}
                  onChange={e => setGoalVal(e.target.value)}
                  className="h-8 text-xs font-mono w-28"
                  placeholder="ml"
                  data-testid="input-hydration-goal"
                />
                <Button size="sm" className="h-8 text-xs" onClick={() => { setHydrationGoal(Number(goalVal)); setGoalEdit(false); }}>Save</Button>
              </div>
            )}

            <div>
              <div className="flex justify-between text-sm font-mono mb-2">
                <span className="font-bold text-2xl">{totalToday}ml</span>
                <span className="text-muted-foreground self-end">{pct}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mt-1">{data.hydrationGoal}ml daily goal</div>
            </div>

            <div className="space-y-2">
              {todayLog.logs.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between text-sm group">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-medium">{l.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">{l.amount}ml</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-mono text-xs">{l.time}</span>
                    <button
                      data-testid={`button-remove-drink-${l.id}`}
                      onClick={() => removeDrink(l.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
              {todayLog.logs.length === 0 && (
                <p className="text-muted-foreground text-xs font-mono">Nothing logged yet today.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Log a Drink</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {DRINK_PRESETS.map((p, i) => (
                <button
                  key={i}
                  data-testid={`button-preset-drink-${i}`}
                  onClick={() => addDrink({ name: p.name, amount: p.amount, time: new Date().toTimeString().slice(0, 5) })}
                  className="p-2.5 border border-border rounded-lg text-left hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="text-xs font-bold">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{p.amount}ml</div>
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <p className="text-[10px] font-mono text-muted-foreground uppercase">Custom</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Drink name"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="text-xs"
                  data-testid="input-drink-name"
                />
                <Input
                  type="number"
                  placeholder="ml"
                  value={customAmt}
                  onChange={e => setCustomAmt(e.target.value)}
                  className="w-20 text-xs font-mono"
                  data-testid="input-drink-amount"
                />
              </div>
              <Button className="w-full font-mono uppercase text-xs" onClick={handleCustom} data-testid="button-log-drink">
                <Plus size={13} className="mr-1" /> Log
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function JournalView({ data, saveJournalEntry }: { data: any; saveJournalEntry: any }) {
  const today = dateStr(0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [filterEmotion, setFilterEmotion] = useState<string | null>(null);
  const [customEmotion, setCustomEmotion] = useState('');
  const [viewMode, setViewMode] = useState<'write' | 'browse'>('write');
  const fileRef = useRef<HTMLInputElement>(null);

  const existingEntry = data.journal.find((j: JournalEntry) => j.date === selectedDate);
  const [form, setForm] = useState({
    events: existingEntry?.events || '',
    growth: existingEntry?.growth || '',
    plan: existingEntry?.plan || '',
    emotions: existingEntry?.emotions || [] as string[],
    mood: existingEntry?.mood || 3,
    images: existingEntry?.images || [] as string[],
  });

  const loadEntry = (entry: JournalEntry | undefined) => {
    if (entry) {
      setForm({ events: entry.events, growth: entry.growth, plan: entry.plan, emotions: entry.emotions, mood: entry.mood, images: entry.images });
    } else {
      setForm({ events: '', growth: '', plan: '', emotions: [], mood: 3, images: [] });
    }
  };

  const handleDateChange = (d: string) => {
    setSelectedDate(d);
    loadEntry(data.journal.find((j: JournalEntry) => j.date === d));
  };

  const toggleEmotion = (e: string) => {
    setForm(f => ({
      ...f,
      emotions: f.emotions.includes(e) ? f.emotions.filter((x: string) => x !== e) : [...f.emotions, e],
    }));
  };

  const addCustomEmotion = () => {
    if (!customEmotion.trim()) return;
    const e = customEmotion.trim();
    if (!form.emotions.includes(e)) setForm(f => ({ ...f, emotions: [...f.emotions, e] }));
    setCustomEmotion('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size > 500 * 1024) { alert('Image too large — keep under 500KB to avoid storage issues.'); return; }
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(f => ({ ...f, images: [...f.images, ev.target?.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (i: number) => setForm(f => ({ ...f, images: f.images.filter((_: string, idx: number) => idx !== i) }));

  const handleSave = () => {
    saveJournalEntry({ date: selectedDate, ...form });
  };

  const MOOD_LABELS: Record<number, string> = { 1: 'Rough', 2: 'Meh', 3: 'Okay', 4: 'Good', 5: 'Great' };

  const filteredEntries = filterEmotion
    ? data.journal.filter((j: JournalEntry) => j.emotions.includes(filterEmotion))
    : data.journal;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={viewMode === 'write' ? 'default' : 'outline'} size="sm" className="font-mono text-xs uppercase" onClick={() => setViewMode('write')}>Write</Button>
        <Button variant={viewMode === 'browse' ? 'default' : 'outline'} size="sm" className="font-mono text-xs uppercase" onClick={() => setViewMode('browse')}>Browse</Button>
      </div>

      {viewMode === 'browse' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterEmotion(null)}
              className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${!filterEmotion ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              All
            </button>
            {EMOTIONS.map(e => (
              <button
                key={e}
                onClick={() => setFilterEmotion(filterEmotion === e ? null : e)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${filterEmotion === e ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
              >
                {e}
              </button>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <p className="text-muted-foreground text-sm font-mono text-center py-12">No journal entries yet. Start writing!</p>
          )}

          <div className="space-y-3">
            {filteredEntries.map((j: JournalEntry) => (
              <Card
                key={j.id}
                data-testid={`journal-entry-${j.id}`}
                className="bg-card/50 border-border hover:border-primary/30 cursor-pointer transition-colors"
                onClick={() => { handleDateChange(j.date); setViewMode('write'); }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-sm font-bold">
                      {new Date(j.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{MOOD_LABELS[j.mood]}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(m => (
                          <div key={m} className={`w-2 h-2 rounded-sm ${m <= j.mood ? 'bg-primary' : 'bg-muted'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {j.events && <p className="text-sm text-foreground/80 line-clamp-2 mb-2">{j.events}</p>}
                  <div className="flex flex-wrap gap-1">
                    {j.emotions.map(e => (
                      <Badge key={e} variant="outline" className="text-[10px] px-2 py-0">{e}</Badge>
                    ))}
                  </div>
                  {j.images.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {j.images.slice(0, 3).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-10 h-10 rounded object-cover border border-border" />
                      ))}
                      {j.images.length > 3 && <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground">+{j.images.length - 3}</div>}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'write' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => handleDateChange(dateStr(new Date(selectedDate) > new Date(today) ? 0 : 1))} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft size={16} />
              </button>
              <Input
                type="date"
                value={selectedDate}
                max={today}
                onChange={e => handleDateChange(e.target.value)}
                className="font-mono text-sm flex-1"
                data-testid="input-journal-date"
              />
              <button
                onClick={() => { if (selectedDate < today) handleDateChange(dateStr(Math.max(0, -1))); }}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                disabled={selectedDate >= today}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Today's Events</label>
                <Textarea
                  placeholder="What happened today? Key moments, conversations, things that stood out..."
                  className="mt-1.5 h-24 text-sm bg-background/50 resize-none"
                  value={form.events}
                  onChange={e => setForm(f => ({ ...f, events: e.target.value }))}
                  data-testid="textarea-journal-events"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Growth & Learning</label>
                <Textarea
                  placeholder="What did you learn? What could you do better? Any wins?"
                  className="mt-1.5 h-20 text-sm bg-background/50 resize-none"
                  value={form.growth}
                  onChange={e => setForm(f => ({ ...f, growth: e.target.value }))}
                  data-testid="textarea-journal-growth"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Tomorrow's Plan</label>
                <Textarea
                  placeholder="What are the 3 most important things for tomorrow?"
                  className="mt-1.5 h-20 text-sm bg-background/50 resize-none"
                  value={form.plan}
                  onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
                  data-testid="textarea-journal-plan"
                />
              </div>
            </div>

            <Button className="w-full font-mono uppercase text-xs" onClick={handleSave} data-testid="button-save-journal">
              Save Entry
            </Button>
          </div>

          <div className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">How are you feeling?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-bold mb-1">{MOOD_LABELS[form.mood]}</div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(m => (
                      <button
                        key={m}
                        data-testid={`mood-${m}`}
                        onClick={() => setForm(f => ({ ...f, mood: m }))}
                        className={`flex-1 h-8 rounded font-mono font-bold text-xs transition-colors ${
                          m === form.mood ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mb-2">Emotions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTIONS.map(e => (
                      <button
                        key={e}
                        data-testid={`emotion-${e}`}
                        onClick={() => toggleEmotion(e)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          form.emotions.includes(e)
                            ? 'bg-primary/15 text-primary border-primary/30'
                            : 'border-border text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                    {form.emotions.filter((e: string) => !EMOTIONS.includes(e)).map((e: string) => (
                      <button
                        key={e}
                        onClick={() => toggleEmotion(e)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium border bg-primary/15 text-primary border-primary/30"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    <Input
                      placeholder="Add emotion..."
                      value={customEmotion}
                      onChange={e => setCustomEmotion(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomEmotion()}
                      className="h-7 text-xs"
                      data-testid="input-custom-emotion"
                    />
                    <Button size="sm" variant="outline" className="h-7 px-2" onClick={addCustomEmotion}>
                      <Plus size={12} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-[10px] text-muted-foreground font-mono">Images under 500KB are saved locally. For videos, add a YouTube or Google Photos link in the Events section.</p>
                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  data-testid="input-journal-image"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-mono uppercase"
                  onClick={() => fileRef.current?.click()}
                  data-testid="button-upload-image"
                >
                  <Plus size={12} className="mr-1" /> Add Photo
                </Button>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5">
                    {form.images.map((img: string, i: number) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={img} alt="" className="w-full h-full rounded object-cover border border-border" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
