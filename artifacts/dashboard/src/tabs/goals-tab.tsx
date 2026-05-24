import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/hooks/use-store';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const catColors: Record<string, string> = {
  school: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
  finance: 'text-green-500 border-green-500/20 bg-green-500/10',
  health: 'text-red-500 border-red-500/20 bg-red-500/10',
  personal: 'text-purple-500 border-purple-500/20 bg-purple-500/10',
};

export function GoalsTab() {
  const { data, updateGoal } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Goals Market</h2>
          <p className="text-muted-foreground mt-1 font-mono text-sm uppercase tracking-widest">Tracking Performance</p>
        </div>
        <Button variant="outline" size="sm" className="font-mono text-xs uppercase">New Issue</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.goals.map((g: any) => {
          const chartData = g.history.map((val: number, i: number) => ({ i, val }));
          const progress = Math.min(100, Math.round((g.current / g.target) * 100));
          const isUp = g.history.length > 1 && g.current > g.history[g.history.length - 2];

          return (
            <Card key={g.id} className="bg-card/50 overflow-hidden relative group border-border hover:border-primary/50 transition-colors">
              <div className={`absolute top-0 right-0 p-4 text-2xl font-mono ${isUp ? 'text-green-500' : 'text-primary'}`}>
                {progress}%
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`uppercase font-mono text-[10px] ${catColors[g.category] || 'text-primary'}`}>
                    {g.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold">{g.name}</CardTitle>
                <div className="text-sm font-mono text-muted-foreground">
                  TARGET: {g.target} | CURRENT: {g.current}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-24 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke={isUp ? '#22c55e' : 'hsl(var(--primary))'} 
                        strokeWidth={2} 
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {editingId === g.id ? (
                    <>
                      <Input 
                        type="number" 
                        value={editVal} 
                        onChange={e => setEditVal(e.target.value)} 
                        className="w-24 h-8 text-xs font-mono"
                      />
                      <Button size="sm" className="h-8 text-xs" onClick={() => {
                        if (editVal) updateGoal(g.id, Number(editVal));
                        setEditingId(null);
                      }}>Save</Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8 text-xs font-mono uppercase" onClick={() => {
                      setEditingId(g.id);
                      setEditVal(g.current.toString());
                    }}>Update</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
