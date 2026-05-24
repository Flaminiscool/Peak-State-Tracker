import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Home, Target, BookOpen, CheckCircle, HeartPulse, Wallet, Moon, Sun } from 'lucide-react';
import { HomeTab } from './tabs/home-tab';
import { GoalsTab } from './tabs/goals-tab';
import { StudyTab } from './tabs/study-tab';
import { HabitsTab } from './tabs/habits-tab';
import { HealthTab } from './tabs/health-tab';
import { FinanceTab } from './tabs/finance-tab';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('dashboard-theme');
    return stored !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dashboard-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dashboard-theme', 'light');
    }
  }, [isDark]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="dashboard-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-primary/30">
        <div className="w-full md:w-60 bg-card/80 backdrop-blur-xl border-b md:border-r border-border p-4 flex flex-col md:h-screen md:sticky top-0 z-50">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h1 className="text-base font-bold font-mono tracking-tighter text-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-sm inline-block animate-pulse" />
                SHREYASH
              </h1>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest pl-[18px]">Command Center</div>
            </div>
            <button
              data-testid="button-theme-toggle"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {[
              { id: 'home', icon: <Home size={15} />, label: 'Overview' },
              { id: 'goals', icon: <Target size={15} />, label: 'Goals Market' },
              { id: 'study', icon: <BookOpen size={15} />, label: 'Curriculum' },
              { id: 'habits', icon: <CheckCircle size={15} />, label: 'Protocols' },
              { id: 'health', icon: <HeartPulse size={15} />, label: 'Biometrics' },
              { id: 'finance', icon: <Wallet size={15} />, label: 'Treasury' },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                data-testid={`nav-${id}`}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-xs font-medium whitespace-nowrap font-mono tracking-tight uppercase
                  ${activeTab === id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto hidden md:block pt-8 px-2">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-40">
              System Online<br />NSW, Australia
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 md:overflow-y-auto w-full">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'goals' && <GoalsTab />}
          {activeTab === 'study' && <StudyTab />}
          {activeTab === 'habits' && <HabitsTab />}
          {activeTab === 'health' && <HealthTab />}
          {activeTab === 'finance' && <FinanceTab />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
