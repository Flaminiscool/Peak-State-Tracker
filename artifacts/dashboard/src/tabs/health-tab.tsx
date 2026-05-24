import { useStore } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

export function HealthTab() {
  const { data } = useStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Biometrics</h2>
        <p className="text-muted-foreground mt-1 font-mono text-sm uppercase tracking-widest">Health & Sleep</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-mono uppercase">Sleep Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sleep}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))'}} 
                    contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))'}} 
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Hydration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(cup => (
                  <div key={cup} className={`h-12 flex-1 rounded-sm ${cup <= 3 ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
              <div className="text-right mt-2 text-xs font-mono font-bold">750ml / 2000ml</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Daily Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map(m => (
                  <button key={m} className={`w-10 h-10 rounded-full font-bold transition-colors ${m === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
