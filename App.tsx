
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History as HistoryIcon, 
  CreditCard, 
  LogOut, 
  Settings,
  Menu,
  X,
  Palette
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import History from './components/History';
import Pricing from './components/Pricing';
import { getUserProfile } from './services/storageService';
import { UserProfile } from './types';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link 
    to={path} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
      : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserProfile>(getUserProfile());

  // Periodically refresh profile to show updated stats
  useEffect(() => {
    const interval = setInterval(() => {
      setUser(getUserProfile());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 kdp-gradient rounded-xl flex items-center justify-center text-white">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">KDP ColorMaster</h1>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">AI Studio</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
              <SidebarContent />
            </nav>

            <div className="p-4 mt-auto">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">CREDITS</span>
                  <span className={`text-xs font-bold ${user.generationsRemaining < 2 ? 'text-red-500' : 'text-indigo-600'}`}>
                    {user.plan === 'Pro' ? '∞' : `${user.generationsRemaining}/5`}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                  <div 
                    className="kdp-gradient h-1.5 rounded-full" 
                    style={{ width: user.plan === 'Pro' ? '100%' : `${(user.generationsRemaining / 5) * 100}%` }}
                  ></div>
                </div>
                <Link to="/pricing" className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 lg:px-8">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold">{user.email}</span>
                  <span className="text-xs font-medium text-slate-400">{user.plan} Account</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold">
                  JS
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/generate" element={<Generator user={user} />} />
              <Route path="/history" element={<History />} />
              <Route path="/pricing" element={<Pricing />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const SidebarContent = () => {
  const location = useLocation();
  return (
    <>
      <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" active={location.pathname === '/'} />
      <SidebarItem icon={PlusCircle} label="Generate" path="/generate" active={location.pathname === '/generate'} />
      <SidebarItem icon={HistoryIcon} label="My Collection" path="/history" active={location.pathname === '/history'} />
      <SidebarItem icon={CreditCard} label="Billing" path="/pricing" active={location.pathname === '/pricing'} />
      <hr className="my-4 border-slate-100" />
      <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === '/settings'} />
      <SidebarItem icon={LogOut} label="Log Out" path="/logout" active={false} />
    </>
  );
};

export default App;
