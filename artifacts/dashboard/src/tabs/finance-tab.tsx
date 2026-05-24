import { useStore } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export function FinanceTab() {
  const { data, addTransaction } = useStore();
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('');
  const [type, setType] = useState('expense');

  const progress = Math.min(100, Math.round((data.finance.balance / data.finance.goal) * 100));

  const handleAdd = () => {
    if (!amt || !cat) return;
    addTransaction({ type, amount: amt, category: cat, date: new Date().toISOString().split('T')[0] });
    setAmt('');
    setCat('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Treasury</h2>
        <p className="text-muted-foreground mt-1 font-mono text-sm uppercase tracking-widest">Asset Management</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-8">
              <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Net Liquidity</div>
              <div className="text-6xl font-bold font-mono tracking-tighter">${data.finance.balance}</div>
              
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-sm font-mono font-bold">
                  <span>SAVINGS GOAL: ${data.finance.goal}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-primary-foreground/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {data.finance.transactions.map((t: any) => (
                  <div key={t.id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-bold">{t.category}</div>
                      <div className="text-xs font-mono text-muted-foreground">{t.date}</div>
                    </div>
                    <div className={`font-mono font-bold ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 border-border h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">New Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="font-mono uppercase text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense" className="font-mono text-xs uppercase">Expense</SelectItem>
                <SelectItem value="income" className="font-mono text-xs uppercase">Income</SelectItem>
              </SelectContent>
            </Select>

            <Input 
              type="number" 
              placeholder="Amount" 
              value={amt} 
              onChange={e => setAmt(e.target.value)}
              className="font-mono"
            />
            <Input 
              type="text" 
              placeholder="Category (e.g. Food, Game)" 
              value={cat} 
              onChange={e => setCat(e.target.value)}
            />
            <Button className="w-full font-mono uppercase font-bold text-xs" onClick={handleAdd}>Record</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
