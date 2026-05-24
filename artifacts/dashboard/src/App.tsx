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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="dashboard-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-primary/30">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-card/80 backdrop-blur-xl border-b md:border-r border-border p-4 flex flex-col md:h-screen sticky top-0 z-50">
          <div className="flex justify-between items-center mb-8 px-2">
            <h1 className="text-xl font-bold font-mono tracking-tighter text-primary flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-sm inline-block animate-pulse"></span>
              SHREYASH.OS
            </h1>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <NavButton icon={<Home size={16} />} label="Overview" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavButton icon={<Target size={16} />} label="Goals Market" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
            <NavButton icon={<BookOpen size={16} />} label="Curriculum" active={activeTab === 'study'} onClick={() => setActiveTab('study')} />
            <NavButton icon={<CheckCircle size={16} />} label="Protocols" active={activeTab === 'habits'} onClick={() => setActiveTab('habits')} />
            <NavButton icon={<HeartPulse size={16} />} label="Biometrics" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
            <NavButton icon={<Wallet size={16} />} label="Treasury" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          </nav>

          <div className="mt-auto hidden md:block pt-8 px-2">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-50">
              System Online<br />
              Status: Nominal
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 md:overflow-y-auto max-w-6xl mx-auto w-full">
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

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-medium whitespace-nowrap font-mono tracking-tight uppercase
        ${active 
          ? 'bg-primary/10 text-primary border border-primary/20' 
          : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
